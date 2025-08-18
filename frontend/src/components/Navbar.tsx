import { JSX } from 'react';

import NavLink from '../components/common/NavLink';

const Navbar = (): JSX.Element => {
  return (
    <nav className="w-100vw flex justify-center">
      <NavLink to="campaigns" content="Campaigns" />
    </nav>
  );
};

export default Navbar;
