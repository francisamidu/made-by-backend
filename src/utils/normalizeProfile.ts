import { OAuthProvider, OAuthProfile } from '@/types/auth';

// Profile Normalizer
export const normalizeProfile = (
  profile: any,
  provider: OAuthProvider,
): OAuthProfile => ({
  provider,
  id: profile.id,
  displayName: profile.displayName || profile.username,
  emails: profile.emails || [{ value: profile.email }],
  photos: profile.photos || [
    { value: profile.avatar_url || profile.profile_image_url },
  ],
  username: profile.username,
});
