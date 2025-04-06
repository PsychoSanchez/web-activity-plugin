import React, { createContext, useContext, useEffect, useState } from 'react';

type RouterContextType = {
  currentRoute: string;
  navigate: (route: string) => void;
};

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export enum Routes {
  Overview = 'overview',
  Calendar = 'calendar',
  Detailed = 'detailed',
  Settings = 'settings',
  IgnoredDomains = 'ignored-domains',
}

const routeValues = Object.values(Routes);

function isRoute(route: string): route is Routes {
  return routeValues.includes(route as Routes);
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState(Routes.Overview);

  const navigate = (route: string) => {
    window.location.hash = `#/${route}`;
  };

  useEffect(() => {
    // Handle initial route
    const hash = window.location.hash.replace('#/', '') || Routes.Overview;
    if (isRoute(hash)) {
      setCurrentRoute(hash);
    }

    // Handle route changes
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#/', '') || Routes.Overview;

      if (isRoute(newHash)) {
        setCurrentRoute(newHash);
      } else {
        setCurrentRoute(Routes.Overview);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
