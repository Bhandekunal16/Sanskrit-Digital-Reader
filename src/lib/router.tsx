import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AppRoute = 
  | '/'
  | '/dictionary'
  | '/transliteration'
  | '/translation'
  | '/reader'
  | '/technology'
  | '/about';

export interface NavItemConfig {
  name: string;
  href: AppRoute;
}

export const NAV_ITEMS: NavItemConfig[] = [
  { name: 'Home', href: '/' },
  { name: 'Dictionary', href: '/dictionary' },
  { name: 'Transliteration', href: '/transliteration' },
  { name: 'Translation', href: '/translation' },
  { name: 'Reader', href: '/reader' },
  { name: 'Language Technology', href: '/technology' },
  { name: 'About', href: '/about' },
];

interface RouterContextType {
  pathname: string;
  navigate: (href: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: '/',
  navigate: () => {},
});

export function normalizePath(path: string): string {
  if (!path) return '/';
  // Remove trailing slashes except for root
  const cleaned = path.replace(/\/+$/, '');
  return cleaned === '' ? '/' : cleaned;
}

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = normalizePath(window.location.pathname);
      // Validate against known routes or default to /
      const validRoutes = NAV_ITEMS.map((item) => item.href as string);
      return validRoutes.includes(p) ? p : '/';
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const p = normalizePath(window.location.pathname);
      setPathname(p);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (href: string) => {
    const normalized = normalizePath(href);
    if (normalized !== pathname) {
      window.history.pushState({}, '', normalized);
      setPathname(normalized);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <RouterContext.Provider value={{ pathname, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

/**
 * Hook to retrieve current route pathname (compatible with Next.js usePathname)
 */
export function usePathname(): string {
  const context = useContext(RouterContext);
  return context.pathname;
}

/**
 * Hook to programmatic navigation (compatible with Next.js useRouter)
 */
export function useRouter() {
  const context = useContext(RouterContext);
  return {
    push: (href: string) => context.navigate(href),
    pathname: context.pathname,
  };
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Universal Next.js compatible Link component with client-side history navigation
 */
export const Link: React.FC<LinkProps> = ({ href, children, className, onClick, ...props }) => {
  const { navigate } = useContext(RouterContext);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    // Allow standard behavior for external links or cmd/ctrl clicks
    if (
      !e.defaultPrevented &&
      e.button === 0 && // Left click
      !e.metaKey &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.shiftKey &&
      href.startsWith('/')
    ) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};
