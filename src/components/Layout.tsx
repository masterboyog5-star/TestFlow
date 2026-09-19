import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Settings, History as HistoryIcon, Home as HomeIcon } from 'lucide-react';
import { clsx } from 'clsx';

export const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-textMain font-mono selection:bg-electric selection:text-background">
      <header className="py-6 px-8 max-w-6xl w-full mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wider text-textMain hover:neon-text-cyan transition-shadow">
          TYPEFLOW
        </Link>
        <nav className="flex gap-6">
          <Link to="/" className={clsx("hover:text-cyan transition-colors", location.pathname === '/' && "text-cyan neon-text-cyan")}>
            <HomeIcon size={24} />
          </Link>
          <Link to="/history" className={clsx("hover:text-cyan transition-colors", location.pathname === '/history' && "text-cyan neon-text-cyan")}>
            <HistoryIcon size={24} />
          </Link>
          <Link to="/settings" className={clsx("hover:text-cyan transition-colors", location.pathname === '/settings' && "text-cyan neon-text-cyan")}>
            <Settings size={24} />
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-8 w-full max-w-6xl mx-auto">
        <Outlet />
      </main>
      
      <footer className="py-6 text-center text-textSecondary text-sm font-sans">
        <div className="inline-block relative group cursor-default">
          <div className="absolute inset-0 bg-electric opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-500 rounded-full"></div>
          <span className="relative z-10 transition-colors duration-300 group-hover:text-electric tracking-wide">
            Developed by Mohammed Ameen K
          </span>
        </div>
      </footer>
    </div>
  );
};
