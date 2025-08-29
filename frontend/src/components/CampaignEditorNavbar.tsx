import { JSX } from 'react';

import { CampaignEditorRoutePaths } from '../constants/RoutePaths';

import Container from './common/Container';
import NavLink from './common/NavLink';

const CampaignEditorNavbar = (): JSX.Element => {
  return (
    <Container className="h-max flex-col items-center p-6">
      <NavLink to={CampaignEditorRoutePaths.INFORMATION} className="w-48">
        Information
      </NavLink>

      <NavLink to={CampaignEditorRoutePaths.CHARACTERS} className="w-48">
        Characters
      </NavLink>

      <NavLink to={CampaignEditorRoutePaths.ITEMS} className="w-48">
        Items
      </NavLink>

      <NavLink to={CampaignEditorRoutePaths.STRUCTURE} className="w-48">
        Structure
      </NavLink>

      <NavLink to={CampaignEditorRoutePaths.STORY} className="w-48">
        Story
      </NavLink>
    </Container>
  );
};

export default CampaignEditorNavbar;
