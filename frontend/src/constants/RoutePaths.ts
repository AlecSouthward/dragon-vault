const RoutePaths = {
  LOGIN: '',
  ABOUT: 'about',
  PRIVACY_POLICY: 'privacy-policy',
  CAMPAIGN_EDITOR: 'campaign-editor/:id',
  CAMPAIGNS: 'campaigns',
  CHARACTER: 'character',
  ROLL: 'roll',
} as const;

export const CampaignEditorRoutePaths = {
  INFORMATION: 'information',
  CHARACTERS: 'characters',
  ITEMS: 'items',
  STRUCTURE: 'structure',
  STORY: 'story',
} as const;

export default RoutePaths;
