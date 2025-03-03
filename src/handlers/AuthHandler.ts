// src/handlers/AuthHandler.ts
import { Request, Response } from 'express';
import { AuthService } from '@/services/AuthService';
import { TCreator, TSocialLinks } from '@/types/schema';

/**
 * Handler for authentication-related operations
 */
export class AuthHandler {
  /**
   * Handle OAuth authentication
   */
  async handleOAuthLogin(req: Request, res: Response) {
    const { provider, profile } = req.body;
    const creator = (await AuthService.authenticateWithOAuth(
      profile,
    )) as TCreator;

    if (creator) {
      const tokens = await AuthService.generateAuthTokens(creator);
      res.json({ creator, ...tokens });
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refreshToken(refreshToken);

    if (tokens) {
      res.json(tokens);
    } else {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }

  /**
   * Update social links
   */
  async updateSocialLinks(req: Request, res: Response) {
    const creatorId = req.params.id;
    const socialLinks: Partial<TSocialLinks> = req.body;

    const updated = await AuthService.updateSocialLinks(creatorId, socialLinks);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Creator not found' });
    }
  }

  /**
   * Validate session
   */
  async validateSession(req: Request, res: Response) {
    const { accessToken } = req.body;
    const creator = await AuthService.validateSession(accessToken);

    if (creator) {
      res.json(creator);
    } else {
      res.status(401).json({ error: 'Invalid session' });
    }
  }

  /**
   * Logout
   */
  async logout(req: Request, res: Response) {
    const creatorId = req.params.id;
    await AuthService.logout(creatorId);
    res.json({ success: true });
  }
}
