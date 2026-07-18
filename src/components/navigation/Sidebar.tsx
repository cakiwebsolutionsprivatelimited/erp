import React, { useState } from 'react';
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
  ChevronDown,
  ChevronUp,
  LogOut,
  UserCircle,
  Briefcase,
  Layers,
  Component,
  Grid3X3
} from 'lucide-react';
import { cn } from '@/utils';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Grid3X3, label: 'Apps', path: '/apps' },
  { icon: Briefcase, label: 'CRM', path: '/crm' },
  { 
    icon: Users, 
    label: 'HRMS', 
    path: '/hrms',
    children: [
      { label: 'Directory', path: '/hrms' },
      { label: 'Employee List', path: '/hrms/employees/list' },
      { label: 'Add Employee', path: '/hrms/employees/add' }
    ]
  },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: FileText, label: 'Invoices', path: '/invoices' },
  { icon: CreditCard, label: 'Billing', path: '/billing' },
  { icon: Layers, label: 'Pricing', path: '/pricing' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
  { icon: Component, label: 'Components', path: '/dev/components' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ HRMS: true });

  const toggleSubmenu = (label: string) => {
    if (collapsed) {
      setCollapsed(false);
      setOpenMenus(prev => ({ ...prev, [label]: true }));
    } else {
      setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
    }
  };

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
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const hasChildren = !!item.children;
            const isMenuOpen = openMenus[item.label];

            if (hasChildren) {
              return (
                <div key={item.label} className="space-y-1">
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all duration-200 group relative",
                      isMenuOpen && !collapsed
                        ? "bg-primary/5 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={22} className={cn("shrink-0 transition-transform duration-200", collapsed ? "" : "group-hover:scale-110")} />
                      {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                    </div>
                    {!collapsed && (
                      isMenuOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />
                    )}
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </button>

                  {isMenuOpen && !collapsed && (
                    <div className="pl-6 border-l ml-5 mt-1.5 space-y-1 animate-in slide-in-from-top-1 duration-200">
                      {item.children?.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          end={child.path === '/hrms'}
                          className={({ isActive }) => cn(
                            "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 block",
                            isActive 
                              ? "bg-primary/10 text-primary font-bold" 
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
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
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
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
export default Sidebar;
