import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Navbar } from '@/components/navigation/Navbar';
import { cn } from '@/utils';

const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out flex flex-col min-h-screen",
          sidebarCollapsed ? "md:pl-20" : "md:pl-64"
        )}
      >
        <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="flex-1 overflow-x-hidden">
          <Outlet />
        </div>
        
        {/* Footer */}
        <footer className="py-6 px-8 border-t bg-background/50 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Cakiweb Solutions Pvt. Ltd. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
