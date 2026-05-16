import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <h1 className="text-9xl font-black text-primary/10">404</h1>
      <div className="absolute">
        <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/10"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
