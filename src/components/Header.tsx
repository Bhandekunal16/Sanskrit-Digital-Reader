import React, { useState, useEffect, useRef } from 'react';
import { Link, usePathname, useRouter } from '../lib/router';
import { Navigation } from './Navigation';
import { Search, Menu, X, Globe, BookOpen } from 'lucide-react';

interface HeaderProps {
  onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Lock scroll while modal menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSearchAction = () => {
    if (onSearchClick) {
      onSearchClick();
    } else {
      router.push('/dictionary');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E8E1D5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] rounded-md py-1"
          aria-label="Sanskrit Digital Reader Home"
        >
          <div className="w-8 h-8 rounded bg-[#2C241E] text-[#FBF9F5] flex items-center justify-center font-devanagari font-bold text-lg shadow-xs group-hover:bg-[#8C4A2F] transition-colors">
            सं
          </div>
          <span className="font-serif-editorial text-xl font-semibold tracking-tight text-[#1C1917]">
            Sanskrit Digital Reader
          </span>
        </Link>

        {/* Zone 2: Desktop Navigation Links */}
        <div className="hidden lg:flex items-center">
          <Navigation layout="desktop" />
        </div>

        {/* Zone 3: Primary Actions & Mobile Hamburger */}
        <div className="flex items-center gap-2.5">
          
          <button
            type="button"
            onClick={handleSearchAction}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-[#1C1917] bg-[#EFE9DD] hover:bg-[#E5DCF] rounded-lg transition-colors border border-[#DCD3C3] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
            aria-label="Search Sanskrit lexicon"
          >
            <Search className="w-3.5 h-3.5 text-[#78716C]" />
            <span className="hidden sm:inline">Search Lexicon</span>
          </button>

          <Link
            href="/reader"
            className="hidden sm:inline-flex items-center px-3.5 py-1.5 text-xs font-medium text-[#FBF9F5] bg-[#2C241E] hover:bg-[#8C4A2F] rounded-lg transition-colors whitespace-nowrap shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
          >
            Open Reader
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#1C1917] hover:bg-[#EFE9DD] rounded-lg border border-[#DCD3C3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[#8C4A2F]" />
            ) : (
              <Menu className="w-5 h-5 text-[#1C1917]" />
            )}
          </button>

        </div>

      </div>

      {/* Mobile Navigation Drawer / Modal Overlay */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-navigation-menu"
          className="fixed inset-0 top-16 z-50 lg:hidden bg-black/30 backdrop-blur-xs flex flex-col"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FBF9F5] border-b border-[#E8E1D5] shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="p-4 border-b border-[#E8E1D5] bg-[#FAF7F2] flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F]">
                Navigation Menu
              </span>
              <span className="text-xs text-[#78716C] font-mono-code">
                7 Core Sections
              </span>
            </div>

            <Navigation
              layout="mobile"
              onItemClick={() => setIsMobileMenuOpen(false)}
            />

            <div className="p-4 border-t border-[#E8E1D5] bg-[#FAF7F2] space-y-2">
              <Link
                href="/reader"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2 px-3 text-xs font-semibold text-center text-white bg-[#2C241E] hover:bg-[#8C4A2F] rounded-lg block transition-colors"
              >
                Launch Sanskrit Reader
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
