import { useContext } from 'react';

import {
  CampaignContext,
  CampaignContextType,
} from '../context/CampaignContext';

const useCampaign = (): CampaignContextType => {
  const ctx = useContext(CampaignContext);

  if (!ctx) throw new Error('useCampaign must be used within CampaignProvider');

  return ctx;
};

export default useCampaign;
