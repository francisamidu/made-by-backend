// config/oauth.ts

import { OAuthProviders } from '@/types/auth';
import env from '@/env';

const {
  BACKEND_URL,
  GITHUB_CALLBACK_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  TWITTER_CALLBACK_URL,
  TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET,
} = env;

const OAUTH_CONFIG: OAuthProviders = {
  google: {
    clientId: GOOGLE_CLIENT_ID!,
    clientSecret: GOOGLE_CLIENT_SECRET!,
    callbackUrl: `${BACKEND_URL}/${GOOGLE_CALLBACK_URL}`,
    scope: ['profile', 'email'],
  },
  github: {
    clientId: GITHUB_CLIENT_ID!,
    clientSecret: GITHUB_CLIENT_SECRET!,
    callbackUrl: `${BACKEND_URL}/${GITHUB_CALLBACK_URL}`,
    scope: ['user:email'],
  },
  twitter: {
    consumerKey: TWITTER_CLIENT_ID!,
    consumerSecret: TWITTER_CLIENT_SECRET!,
    callbackUrl: `${BACKEND_URL}/${TWITTER_CALLBACK_URL}`,
    scope: ['tweet.read', 'users.read'],
  },
};

export default OAUTH_CONFIG;
