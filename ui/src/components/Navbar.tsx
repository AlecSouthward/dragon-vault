import { JSX } from 'react';

import RoutePaths from '../constants/RoutePaths';

import NavLink from './common/NavLink';

const Navbar = (): JSX.Element => {
  return (
    <nav className="w-100vw border-light-white bg-light-black sticky top-0 z-1 flex justify-center border-b-2 select-none">
      <NavLink to={RoutePaths.CAMPAIGNS}>Campaigns</NavLink>

      <NavLink to={RoutePaths.CHARACTER}>Character</NavLink>

      <NavLink to={RoutePaths.ROLL}>Roll Dice</NavLink>
    </nav>
  );
};

export default Navbar;
