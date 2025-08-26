import { JSX } from 'react';

import RoutePaths from '../constants/RoutePaths';

import NavLink from '../components/common/NavLink';

const Navbar = (): JSX.Element => {
  return (
    <nav className="w-100vw border-light-white bg-light-black sticky top-0 z-1 flex justify-center border-b-2 select-none">
      <NavLink to={RoutePaths.CAMPAIGNS} children="Campaigns" />
      <NavLink to={RoutePaths.CHARACTER} children="Character" />
      <NavLink to={RoutePaths.ROLL} children="Roll Dice" />
    </nav>
  );
};

export default Navbar;
