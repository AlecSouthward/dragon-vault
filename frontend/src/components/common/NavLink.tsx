import { FC, JSX, ReactNode } from 'react';
import { NavLink as ReactNavLink } from 'react-router-dom';

type NavLinkProps = {
  to: string;
  children?: ReactNode;
  className?: string;
};

const NavLink: FC<NavLinkProps> = ({
  to,
  children,
  className = '',
}): JSX.Element => {
  return (
    <ReactNavLink
      className={({ isActive }) =>
        `${isActive ? 'text-light-black bg-light-white' : 'text-light-white'} border-light-white m-4 w-40 content-center rounded-sm border-2 px-3 text-center text-2xl font-bold hover:opacity-85 ${className}`
      }
      to={to}
    >
      {children}
    </ReactNavLink>
  );
};

export default NavLink;
