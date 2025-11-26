import { FC, JSX, ReactNode } from 'react';

import { Outlet } from 'react-router-dom';

import CampaignEditorNavbar from '../components/CampaignEditorNavbar';

type CampaignEditorLayoutProps = { children?: ReactNode };

const CampaignEditorLayout: FC<CampaignEditorLayoutProps> = (): JSX.Element => (
  <div className="flex w-full justify-center gap-x-6 px-24 py-6">
    <CampaignEditorNavbar />

    <div className="h-max w-min">
      <Outlet />
    </div>
  </div>
);

export default CampaignEditorLayout;
