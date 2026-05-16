import React from 'react';
import { Outlet } from 'react-router-dom';

const ErrorLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <Outlet />
      </div>
    </div>
  );
};

export default ErrorLayout;
