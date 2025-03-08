import { TCreator } from './schema';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface OAuthProfile {
  id: string;
  provider: OAuthProvider;
  displayName: string;
  emails: Array<{ value: string }>;
  photos: Array<{ value: string }>;
  [key: string]: any;
}

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  scope: string[];
}
export interface OAuthCallbackProfile {
  creator?: TCreator;
  tokens?: AuthTokens;
}

export interface OAuthProviders {
  google: OAuthConfig;
  github: OAuthConfig;
  twitter: Pick<OAuthConfig, 'callbackUrl' | 'scope'> & {
    consumerKey: string;
    consumerSecret: string;
  };
}
export type OAuthProvider = 'google' | 'github' | 'twitter';
