import { JSX } from 'react';

import NavLink from '../components/common/NavLink';

const Navbar = (): JSX.Element => {
  return (
    <nav className="w-100vw border-light-white bg-light-black sticky top-0 z-1 flex justify-center border-b-2">
      <NavLink to="/campaigns" content="Campaigns" />
      <NavLink to="/roll" content="Roll Dice" />
    </nav>
  );
};

export default Navbar;
