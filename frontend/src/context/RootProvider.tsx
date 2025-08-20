import { JSX, ReactNode } from 'react';

import CampaignProvider from './CampaignProvider';

const RootProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  return <CampaignProvider>{children}</CampaignProvider>;
};

export default RootProvider;
