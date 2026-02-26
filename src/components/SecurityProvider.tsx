import { useEffect, ReactNode } from 'react';

interface SecurityProviderProps {
  children: ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  useEffect(() => {
    const enforceSecurityPolicies = () => {
      if (typeof window !== 'undefined') {
        Object.freeze(Object.prototype);
        
        const originalOpen = window.open;
        window.open = function(url, target, features) {
          if (url && typeof url === 'string') {
            const safeUrl = url.startsWith('http://') || url.startsWith('https://') 
              ? url 
              : 'about:blank';
            return originalOpen.call(window, safeUrl, target, features);
          }
          return originalOpen.call(window, 'about:blank', target, features);
        };

        const preventDefaultMiddleware = (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.tagName === 'A') {
            const href = target.getAttribute('href');
            if (href && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('/') && !href.startsWith('#')) {
              e.preventDefault();
              console.warn('Blocked potentially unsafe link:', href);
            }
          }
        };

        document.addEventListener('click', preventDefaultMiddleware, true);

        return () => {
          document.removeEventListener('click', preventDefaultMiddleware, true);
        };
      }
    };

    return enforceSecurityPolicies();
  }, []);

  return <>{children}</>;
}
