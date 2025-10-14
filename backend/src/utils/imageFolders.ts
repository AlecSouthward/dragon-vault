export const IMAGE_FOLDERS = {
  PROFILE_PICTURE: 'user-profile-pictures',
  CAMPAIGN_LOGO: 'campaign-logos',
} as const;

export type ImageFolder = (typeof IMAGE_FOLDERS)[keyof typeof IMAGE_FOLDERS];
