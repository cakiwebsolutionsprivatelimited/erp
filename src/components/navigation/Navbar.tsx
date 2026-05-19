import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setSearchQuery } from '@/store/features/searchSlice';

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const search = useAppSelector((state) => state.search.query);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <header className="sticky top-0 z-30 flex items-center h-16 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center w-full gap-4 md:gap-8">
        <button 
          onClick={onMenuClick}
          className="p-2 transition-colors rounded-md md:hidden hover:bg-muted"
        >
          <Menu size={20} />
        </button>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            value={search}
            onChange={handleSearchChange}
            className="w-full h-10 pl-10 pr-4 transition-all border rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Notifications */}
          <button className="relative p-2 transition-colors rounded-full hover:bg-muted group">
            <Bell size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2 ml-2 border-l">
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold leading-none">{user?.name || 'Guest User'}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role || 'Developer'}</p>
            </div>
            <button className="flex items-center justify-center w-9 h-9 transition-all rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105 border border-primary/20">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
