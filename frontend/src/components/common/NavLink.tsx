import { FC, JSX, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type NavLinkProps = {
  to: string;
  content: ReactNode;
};

const NavLink: FC<NavLinkProps> = ({ to, content }): JSX.Element => {
  return (
    <Link
      className="m-4 rounded-sm bg-zinc-300 px-4 py-1 text-3xl text-zinc-900"
      to={to}
    >
      {content}
    </Link>
  );
};

export default NavLink;
