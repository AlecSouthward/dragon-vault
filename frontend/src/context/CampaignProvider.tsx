import { JSX, type ReactNode, useMemo, useState } from 'react';

import { Campaign } from '../types/dto';

import { CampaignContext, CampaignContextType } from './campaignContext';

type CampaignProviderProps = { children: ReactNode };

const CampaignProvider = ({
  children,
}: Readonly<CampaignProviderProps>): JSX.Element => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  const value = useMemo<CampaignContextType>(
    () => ({ selectedCampaign: campaign, setSelectedCampaign: setCampaign }),
    [campaign]
  );

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};

export default CampaignProvider;
