import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center text-sm font-medium text-muted-foreground mb-4">
      <Link to="/" className="flex items-center hover:text-primary transition-colors">
        <Home size={16} />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={name}>
            <ChevronRight size={16} className="mx-2 text-muted-foreground/50" />
            {isLast ? (
              <span className="text-foreground font-semibold capitalize">
                {name.replace(/-/g, ' ')}
              </span>
            ) : (
              <Link to={routeTo} className="hover:text-primary transition-colors capitalize">
                {name.replace(/-/g, ' ')}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
