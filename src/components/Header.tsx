import React, { useState, useEffect, useRef } from 'react';
import { Link, usePathname, useRouter, NAV_ITEMS } from '../lib/router';
import { Navigation } from './Navigation';
import { Search, Menu, X, BookOpen, Sparkles } from 'lucide-react';

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

  // Handle escape key to close menu and lock body scroll safely
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = originalOverflow || '';
      };
    } else {
      document.body.style.overflow = '';
    }
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
    <header className="sticky top-0 z-50 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E8E1D5] transition-all w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        
        {/* Zone 1: Wordmark & Logo (Responsive & Unbreakable on 320px) */}
        <div className="flex items-center min-w-0 flex-1 md:flex-initial mr-1 sm:mr-4">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 sm:gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] rounded-md py-1 min-w-0"
            aria-label="Sanskrit Digital Reader Home"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2C241E] text-[#FBF9F5] flex items-center justify-center font-devanagari font-bold text-base sm:text-lg shadow-xs group-hover:bg-[#8C4A2F] transition-colors shrink-0">
              सं
            </div>
            <span className="font-serif-editorial text-base sm:text-lg md:text-xl font-semibold tracking-tight text-[#1C1917] truncate">
              Sanskrit Digital Reader
            </span>
          </Link>
        </div>

        {/* Zone 2: Desktop Navigation Links (Visible >= 768px breakpoint) */}
        <div className="hidden md:flex items-center">
          <Navigation layout="desktop" />
        </div>

        {/* Zone 3: Primary Actions & Accessible Hamburger Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Quick Search Action */}
          <button
            type="button"
            onClick={handleSearchAction}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 text-xs font-medium text-[#1C1917] bg-[#EFE9DD] hover:bg-[#E5DCF] rounded-lg transition-colors border border-[#DCD3C3] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] min-h-[38px]"
            aria-label="Search Sanskrit lexicon"
          >
            <Search className="w-3.5 h-3.5 text-[#78716C]" />
            <span className="hidden sm:inline">Search</span>
          </button>

          {/* Quick Reader Action (Tablet/Desktop) */}
          <Link
            href="/reader"
            className="hidden lg:inline-flex items-center px-3.5 py-1.5 text-xs font-medium text-[#FBF9F5] bg-[#2C241E] hover:bg-[#8C4A2F] rounded-lg transition-colors whitespace-nowrap shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] min-h-[38px]"
          >
            Reader
          </Link>

          {/* Mobile Hamburger Button (< 768px breakpoint) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 p-2 text-[#1C1917] hover:bg-[#EFE9DD] rounded-lg border border-[#DCD3C3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] shrink-0"
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

      {/* Mobile Navigation Drawer Overlay (< 768px) */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-navigation-menu"
          className="fixed inset-0 top-16 z-50 md:hidden bg-black/40 backdrop-blur-xs flex flex-col"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FBF9F5] border-b border-[#E8E1D5] shadow-2xl max-h-[calc(100dvh-4rem)] overflow-y-auto flex flex-col justify-between"
          >
            <div>
              <div className="px-4 py-3 border-b border-[#E8E1D5] bg-[#FAF7F2] flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F]">
                  Navigation Menu
                </span>
                <span className="text-[11px] text-[#78716C] font-mono-code">
                  {NAV_ITEMS.length} Modules
                </span>
              </div>

              {/* Shared Mobile Navigation Links */}
              <Navigation
                layout="mobile"
                onItemClick={() => setIsMobileMenuOpen(false)}
              />
            </div>

            {/* Bottom Quick-Launch in Mobile Drawer */}
            <div className="p-4 border-t border-[#E8E1D5] bg-[#FAF7F2] space-y-2">
              <Link
                href="/reader"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-center text-white bg-[#2C241E] hover:bg-[#8C4A2F] rounded-xl flex items-center justify-center gap-2 transition-colors min-h-[44px]"
              >
                <BookOpen className="w-4 h-4 text-[#E2D8C6]" />
                <span>Open Sanskrit Passage Reader</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
