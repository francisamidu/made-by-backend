import { NextFunction, Request, Response } from 'express';
import { AuthService } from '@/services/AuthService';
import { TCreator, TSocialLinks } from '@/types/schema';
import { AppError, UnauthorizedError } from '@/utils/errors';
import { ApiRequest, RegistrationParams } from '@/types/request';
import { ApiResponse, OAuthCallbackResponse } from '@/types/response';
import { OAuthProfile, AuthTokens, OAuthProvider } from '@/types/auth';
import OAUTH_CONFIG from '@/config/oauth';
import passport from 'passport';
import { comparePassword } from '@/utils/password';
import { sanitizeCreator } from '@/utils/sanitizeCreator';
/**
 * Handler for authentication-related operations
 */
export class AuthHandler {
  /**
   * Handle OAuth authentication
   * @route POST /api/auth/oauth
   */
  static async handleOAuth(
    req: ApiRequest,
    res: Response<
      ApiResponse<{
        provider: string;
      }>
    >,
    next: NextFunction,
  ): Promise<void> {
    const provider = req.params.provider as OAuthProvider;
    passport.authenticate(provider, {
      scope: OAUTH_CONFIG[provider].scope,
    })(req, res, next);
  }
  /**
   * Handle Login and Password authentication
   * @route POST /api/auth/login
   */
  static async handleLogin(
    req: ApiRequest,
    res: Response<
      ApiResponse<{
        user: TCreator;
        tokens: AuthTokens;
      }>
    >,
  ) {
    const { email, password } = req.body;

    let user = (await AuthService.findByEmail(email)) as TCreator;

    if (!user) {
      throw new AppError('User not failed', 404);
    }
    const isAuthorized = await comparePassword(
      password,
      user.password as string,
    );
    user = sanitizeCreator(user) as TCreator;
    if (!isAuthorized) {
      throw new UnauthorizedError("Passwords don't match");
    }

    const tokens = await AuthService.generateAuthTokens(user);
    // Update cookies
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      data: {
        user,
        tokens,
      },
    });
  }
  /**
   * Handle Username and Password registration
   * @route POST /api/auth/signup
   */
  static async handleRegister(
    req: ApiRequest,
    res: Response<
      ApiResponse<{
        user: TCreator;
      }>
    >,
  ) {
    const { email, password, fullname } = req.body as RegistrationParams;

    const user = await AuthService.findByEmail(email);
    if (user) {
      throw new AppError('User already exists', 401);
    }

    const newUser = {
      email,
      fullname,
      password,
    };
    const createdUser = (await AuthService.createUser(newUser)) as TCreator;

    res.json({
      data: {
        user: createdUser,
      },
      meta: {
        authenticatedAt: new Date().toISOString(),
      },
      success: true,
    });
  }

  /**
   * Refresh access token
   * @route POST /api/auth/refresh
   */
  static async refreshToken(
    req: ApiRequest<{}, {}, { refreshToken: string }>,
    res: Response<ApiResponse<AuthTokens>>,
  ) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const tokens = await AuthService.refreshToken(refreshToken);

    if (!tokens) {
      throw new AppError('Invalid refresh token', 401);
    }

    res.json({
      data: tokens,
      meta: {
        issuedAt: new Date().toISOString(),
      },
    });
  }

  /**
   * Handle OAuth callback
   * @route POST /api/auth/provider/callback
   */
  static async handleOAuthCallback(
    req: Request,
    res: Response<ApiResponse<OAuthCallbackResponse>>,
  ) {
    try {
      const { user, tokens } = req.user as any;

      // Return tokens and user data as JSON
      res.status(200).json({
        success: true,
        data: {
          user,
          tokens,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Authentication failed',
        data: null,
      });
    }
  }
  /**
   * Update social links
   * @route PUT /api/auth/:id/social-links
   */
  static async updateSocialLinks(
    req: ApiRequest<{ id?: string }, { socialLinks: Partial<TSocialLinks> }>,
    res: Response<ApiResponse<TCreator>>,
  ) {
    const { id } = req.params;
    const { socialLinks } = req.body;

    if (!socialLinks || Object.keys(socialLinks).length === 0) {
      throw new AppError('Social links are required', 400);
    }

    const updated = (await AuthService.updateSocialLinks(
      String(id),
      socialLinks,
    )) as TCreator;

    if (!updated) {
      throw new AppError('Creator not found', 404);
    }

    res.json({
      data: updated,
      meta: {
        updatedAt: new Date().toISOString(),
        updatedFields: Object.keys(socialLinks),
      },
    });
  }

  /**
   * Validate session
   * @route POST /api/auth/validate
   */
  static async validateSession(
    req: ApiRequest<{}, { accessToken: string }>,
    res: Response<ApiResponse<TCreator>>,
  ) {
    const { accessToken } = req.body;

    if (!accessToken) {
      throw new AppError('Access token is required', 400);
    }

    const creator = (await AuthService.validateSession(
      accessToken,
    )) as TCreator;

    if (!creator) {
      throw new AppError('Invalid session', 401);
    }

    res.json({
      data: creator,
      meta: {
        validatedAt: new Date().toISOString(),
      },
    });
  }

  /**
   * Logout
   * @route POST /api/auth/:id/logout
   */
  static async logout(
    req: ApiRequest<{ id?: string }>,
    res: Response<ApiResponse<{ success: boolean }>>,
  ) {
    const { id } = req.params;

    await AuthService.logout(String(id));

    res.json({
      data: { success: true },
      meta: {
        loggedOutAt: new Date().toISOString(),
      },
    });
  }
}
