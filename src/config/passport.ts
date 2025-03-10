import OAUTH_CONFIG from '@/config/oauth';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { AuthService } from '@/services/AuthService';
import { normalizeProfile } from '../utils/normalizeProfile';
import { OAuthProfile } from '@/types/auth';
import { AppError, UnauthorizedError } from '@/utils/errors';
import { db } from '@/db';
import { creators } from '@/db/schema';
import { comparePassword } from '@/utils/password';
import { eq } from 'drizzle-orm';

export const configurePassport = () => {
  //Local - Passport strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const [user] = await db
            .select()
            .from(creators)
            .where(eq(creators.email, email));

          if (!user) {
            return done(new AppError('No user found', 404), false);
          }

          const isValidPassword = await comparePassword(
            password,
            user.password as string,
          );

          if (!isValidPassword) {
            return done(
              new UnauthorizedError("Password's do not match"),
              false,
            );
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
  // Google Strategy
  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: OAUTH_CONFIG.google.clientId,
        clientSecret: OAUTH_CONFIG.google.clientSecret,
        callbackURL: OAUTH_CONFIG.google.callbackUrl,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const normalizedProfile = normalizeProfile(profile, 'google');
          const user =
            await AuthService.authenticateWithOAuth(normalizedProfile);

          if (!user) {
            return done(new AppError('Authentication failed', 401));
          }

          const tokens = await AuthService.generateAuthTokens(user as any);
          done(null, { user, tokens });
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
        callbackURL: 'http://127.0.0.1:5000/api/auth/github/callback',
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: OAuthProfile,
        done: any,
      ) => {
        try {
          const normalizedProfile = normalizeProfile(profile, 'github');
          const user =
            await AuthService.authenticateWithOAuth(normalizedProfile);

          if (!user) {
            return done(new Error('Authentication failed'));
          }

          const tokens = await AuthService.generateAuthTokens(user as any);
          done(null, { user, tokens });
        } catch (error) {
          done(error as Error);
        }
      },
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
          const user =
            await AuthService.authenticateWithOAuth(normalizedProfile);

          if (!user) {
            return done(new Error('Authentication failed'));
          }

          const tokens = await AuthService.generateAuthTokens(user as any);
          done(null, { user, tokens });
        } catch (error) {
          done(error as Error);
        }
      },
    ),
  );
};
