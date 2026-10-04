import React from 'react';
import { Link, usePathname, NAV_ITEMS, NavItemConfig } from '../lib/router';
import { 
  Home, 
  BookOpen, 
  Volume2,
  ArrowRightLeft, 
  Globe, 
  ScrollText, 
  GraduationCap,
  Cpu, 
  Info 
} from 'lucide-react';

interface NavigationProps {
  layout?: 'desktop' | 'mobile' | 'footer';
  onItemClick?: () => void;
  className?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  '/': Home,
  '/dictionary': BookOpen,
  '/vowels-consonants': Volume2,
  '/transliteration': ArrowRightLeft,
  '/translation': Globe,
  '/reader': ScrollText,
  '/quiz': GraduationCap,
  '/technology': Cpu,
  '/about': Info,
};

export const Navigation: React.FC<NavigationProps> = ({
  layout = 'desktop',
  onItemClick,
  className = '',
}) => {
  const currentPathname = usePathname();

  const isRouteActive = (href: string): boolean => {
    if (href === '/') {
      return currentPathname === '/';
    }
    return currentPathname === href;
  };

  // Mobile Layout (>= 44px touch targets, comfortable tap padding)
  if (layout === 'mobile') {
    return (
      <nav aria-label="Mobile Navigation" className={`flex flex-col space-y-1 p-3 sm:p-4 ${className}`}>
        {NAV_ITEMS.map((item: NavItemConfig) => {
          const active = isRouteActive(item.href);
          const Icon = ICON_MAP[item.href] || BookOpen;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-all min-h-[44px] ${
                active
                  ? 'bg-[#2C241E] text-white shadow-xs font-semibold'
                  : 'text-[#57534E] hover:bg-[#F2ECE1] hover:text-[#1C1917] font-medium'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#E2D8C6]' : 'text-[#8C4A2F]'}`} />
              <span className="truncate">{item.name}</span>
              {active && (
                <span className="ml-auto text-[10px] uppercase font-mono-code font-bold tracking-wider text-[#E2D8C6] bg-white/10 px-2 py-0.5 rounded">
                  Active
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    );
  }

  // Footer Layout
  if (layout === 'footer') {
    return (
      <nav aria-label="Footer Navigation" className={`space-y-1.5 text-xs ${className}`}>
        {NAV_ITEMS.map((item: NavItemConfig) => {
          const active = isRouteActive(item.href);
          return (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={onItemClick}
                aria-current={active ? 'page' : undefined}
                className={`transition-colors hover:text-[#1C1917] inline-block py-0.5 ${
                  active ? 'text-[#8C4A2F] font-semibold' : 'text-[#57534E]'
                }`}
              >
                {item.name}
              </Link>
            </div>
          );
        })}
      </nav>
    );
  }

  // Desktop / Tablet Navigation (>= 768px)
  return (
    <nav aria-label="Main Navigation" className={`flex items-center gap-3.5 lg:gap-5 xl:gap-7 text-xs lg:text-sm font-medium text-[#57534E] ${className}`}>
      {NAV_ITEMS.map((item: NavItemConfig) => {
        const active = isRouteActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            aria-current={active ? 'page' : undefined}
            className={`transition-colors hover:text-[#1C1917] py-1 border-b-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] focus-visible:rounded-xs ${
              active
                ? 'text-[#1C1917] border-[#8C4A2F] font-semibold'
                : 'border-transparent text-[#57534E]'
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};
