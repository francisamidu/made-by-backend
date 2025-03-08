import OAUTH_CONFIG from '@/config/oauth';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { AuthService } from '@/services/AuthService';
import { normalizeProfile } from './normalizeProfile';
import { OAuthProfile } from '@/types/auth';

export const configurePassport = () => {
  // Google Strategy
  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: OAUTH_CONFIG.google.clientId,
        clientSecret: OAUTH_CONFIG.google.clientSecret,
        callbackURL: OAUTH_CONFIG.google.callbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const normalizedProfile = normalizeProfile(profile, 'google');
          const creator =
            await AuthService.authenticateWithOAuth(normalizedProfile);

          if (!creator) {
            return done(new Error('Authentication failed'));
          }

          const tokens = await AuthService.generateAuthTokens(creator as any);
          done(null, { creator, tokens });
        } catch (error) {
          done(error as Error);
        }
      },
    ),
  );
  // GitHub Strategy
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: OAUTH_CONFIG.github.clientId,
        clientSecret: OAUTH_CONFIG.github.clientSecret,
        callbackURL: OAUTH_CONFIG.github.callbackUrl,
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: OAuthProfile,
        done: any,
      ) => {
        try {
          const normalizedProfile = normalizeProfile(profile, 'github');
          const creator =
            await AuthService.authenticateWithOAuth(normalizedProfile);

          if (!creator) {
            return done(new Error('Authentication failed'));
          }

          const tokens = await AuthService.generateAuthTokens(creator as any);
          done(null, { creator, tokens });
        } catch (error) {
          done(error as Error);
        }
      },
    ),
  );
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: OAUTH_CONFIG.github.clientId,
        clientSecret: OAUTH_CONFIG.github.clientSecret,
        callbackURL: OAUTH_CONFIG.github.callbackUrl,
      },
      (accessToken, refreshToken, results, profile, verified) => {},
    ),
  );
  // Twitter Strategy
  passport.use(
    'twitter',
    new TwitterStrategy(
      {
        consumerKey: OAUTH_CONFIG.twitter.consumerKey,
        consumerSecret: OAUTH_CONFIG.twitter.consumerSecret,
        callbackURL: OAUTH_CONFIG.twitter.callbackUrl,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const normalizedProfile = normalizeProfile(profile, 'twitter');
          const creator =
            await AuthService.authenticateWithOAuth(normalizedProfile);

          if (!creator) {
            return done(new Error('Authentication failed'));
          }

          const tokens = await AuthService.generateAuthTokens(creator as any);
          done(null, { creator, tokens });
        } catch (error) {
          done(error as Error);
        }
      },
    ),
  );
};
