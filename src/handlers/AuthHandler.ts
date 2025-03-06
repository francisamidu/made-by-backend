import { Response } from 'express';
import { AuthService } from '@/services/AuthService';
import { TCreator, TSocialLinks } from '@/types/schema';
import { AppError } from '@/utils/errors';
import { ApiRequest } from '@/types/request';
import { ApiResponse } from '@/types/response';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface OAuthProfile {
  provider: 'github' | 'google' | 'twitter' | 'linkedin';
  profile: {
    id: string;
    displayName: string;
    emails: Array<{ value: string }>;
    photos: Array<{ value: string }>;
    [key: string]: any;
  };
}

/**
 * Handler for authentication-related operations
 */
export class AuthHandler {
  /**
   * Handle OAuth authentication
   * @route POST /api/auth/oauth
   */
  async handleOAuthLogin(
    req: ApiRequest<{}, {}, OAuthProfile>,
    res: Response<
      ApiResponse<{
        creator: TCreator;
        tokens: AuthTokens;
      }>
    >,
  ) {
    const { provider, profile } = req.body;

    if (!provider || !profile) {
      throw new AppError('Invalid OAuth data', 400);
    }

    const creator = (await AuthService.authenticateWithOAuth(
      profile,
    )) as TCreator;

    if (!creator) {
      throw new AppError('Authentication failed', 401);
    }

    const tokens = await AuthService.generateAuthTokens(creator);

    res.json({
      data: {
        creator,
        tokens,
      },
      meta: {
        provider,
        authenticatedAt: new Date().toISOString(),
      },
    });
  }

  /**
   * Refresh access token
   * @route POST /api/auth/refresh
   */
  async refreshToken(
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
   * Update social links
   * @route PUT /api/auth/:id/social-links
   */
  async updateSocialLinks(
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
  async validateSession(
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
  async logout(
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
