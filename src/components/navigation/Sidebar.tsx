import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Package, 
  FileText, 
  CreditCard, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCircle,
  Briefcase,
  Layers
} from 'lucide-react';
import { cn } from '@/utils';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Briefcase, label: 'CRM', path: '/crm' },
  { icon: Users, label: 'HRMS', path: '/hrms' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: FileText, label: 'Invoices', path: '/invoices' },
  { icon: CreditCard, label: 'Billing', path: '/billing' },
  { icon: Layers, label: 'Pricing', path: '/pricing' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out border-r bg-background",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b">
          {!collapsed && <span className="text-xl font-bold tracking-tight text-primary">Enterprise</span>}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 transition-colors rounded-md hover:bg-muted"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={22} className={cn("shrink-0 transition-transform duration-200", collapsed ? "" : "group-hover:scale-110")} />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t">
          <button className={cn(
            "flex items-center gap-3 w-full px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors",
            collapsed ? "justify-center" : ""
          )}>
            <LogOut size={22} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
