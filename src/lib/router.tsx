import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';

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
  searchParams: URLSearchParams;
  navigate: (href: string, options?: { replace?: boolean; scroll?: boolean }) => void;
  back: () => void;
  forward: () => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: '/',
  searchParams: new URLSearchParams(),
  navigate: () => {},
  back: () => {},
  forward: () => {},
});

/**
 * Normalizes any URL path, stripping origin, search query params, and hash fragments
 * to return a canonical route pathname (e.g. '/technology').
 */
export function normalizePath(path: string): string {
  if (!path) return '/';
  
  let clean = path.trim();

  // Strip origin if full URL is passed
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    try {
      const parsed = new URL(clean);
      clean = parsed.pathname;
    } catch {
      // fallback to path cleaning
    }
  }

  // Strip hash and query parameters
  clean = clean.split('#')[0].split('?')[0];

  // Remove trailing slashes except for root '/'
  clean = clean.replace(/\/+$/, '');

  // Default empty to root
  const result = clean === '' ? '/' : clean;

  // Validate against known routes; if unknown, match closest or default to '/'
  const validRoutes: string[] = NAV_ITEMS.map((item) => item.href);
  return validRoutes.includes(result) ? result : '/';
}

const ROUTE_CHANGE_EVENT = 'applet-route-change';

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });

  const [searchParamsString, setSearchParamsString] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.search;
    }
    return '';
  });

  const searchParams = useMemo(() => new URLSearchParams(searchParamsString), [searchParamsString]);

  const updateLocationState = useCallback(() => {
    if (typeof window === 'undefined') return;
    const normalized = normalizePath(window.location.pathname);
    setPathname(normalized);
    setSearchParamsString(window.location.search);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      updateLocationState();
    };

    const handleCustomRouteChange = () => {
      updateLocationState();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener(ROUTE_CHANGE_EVENT, handleCustomRouteChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener(ROUTE_CHANGE_EVENT, handleCustomRouteChange);
    };
  }, [updateLocationState]);

  const navigate = useCallback((href: string, options?: { replace?: boolean; scroll?: boolean }) => {
    if (typeof window === 'undefined') return;
    
    const targetPath = normalizePath(href);
    const shouldScroll = options?.scroll !== false;

    // Check if query or hash is attached to target href
    let targetFullUrl = targetPath;
    if (href.includes('?') || href.includes('#')) {
      const parts = href.split('?');
      const queryPart = parts[1] ? `?${parts[1]}` : '';
      targetFullUrl = `${targetPath}${queryPart}`;
    }

    if (options?.replace) {
      window.history.replaceState({}, '', targetFullUrl);
    } else {
      window.history.pushState({}, '', targetFullUrl);
    }

    setPathname(targetPath);
    setSearchParamsString(window.location.search);

    // Notify listeners
    window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT));

    if (shouldScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const back = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }, []);

  const forward = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.forward();
    }
  }, []);

  return (
    <RouterContext.Provider value={{ pathname, searchParams, navigate, back, forward }}>
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
 * Hook to retrieve current search parameters (compatible with Next.js useSearchParams)
 */
export function useSearchParams(): URLSearchParams {
  const context = useContext(RouterContext);
  return context.searchParams;
}

/**
 * Hook for programmatic navigation (compatible with Next.js useRouter)
 */
export function useRouter() {
  const context = useContext(RouterContext);
  return {
    push: (href: string, options?: { scroll?: boolean }) => context.navigate(href, { replace: false, ...options }),
    replace: (href: string, options?: { scroll?: boolean }) => context.navigate(href, { replace: true, ...options }),
    back: context.back,
    forward: context.forward,
    pathname: context.pathname,
    searchParams: context.searchParams,
  };
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  className?: string;
  scroll?: boolean;
  replace?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Universal Next.js compatible Link component with client-side history navigation
 */
export const Link: React.FC<LinkProps> = ({ 
  href, 
  children, 
  className, 
  scroll = true, 
  replace = false, 
  onClick, 
  ...props 
}) => {
  const { navigate } = useContext(RouterContext);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    // Allow standard behavior for external links or cmd/ctrl/middle clicks
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
      navigate(href, { scroll, replace });
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};
