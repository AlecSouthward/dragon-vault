import { createContext } from 'react';

import { Campaign } from '../types/dto';

export interface CampaignContextType {
  selectedCampaign: Campaign | null;
  setSelectedCampaign: (c: Campaign | null) => void;
}

export const CampaignContext = createContext<CampaignContextType | null>(null);
