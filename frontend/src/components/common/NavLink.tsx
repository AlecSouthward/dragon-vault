import { FC, JSX, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type NavLinkProps = {
  to: string;
  content: ReactNode;
};

const NavLink: FC<NavLinkProps> = ({ to, content }): JSX.Element => {
  return (
    <Link
      className="border-light-white text-light-white m-4 w-40 content-center rounded-sm border-2 px-3 text-center text-2xl font-bold"
      to={to}
    >
      {content}
    </Link>
  );
};

export default NavLink;
