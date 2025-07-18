import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
interface ServiceWorkerHook {
  isOnline: boolean;
  isUpdateAvailable: boolean;
  updateServiceWorker: () => void;
}

export function useServiceWorker(): ServiceWorkerHook {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);

  useEffect(() => {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker.register('/sw.js')
        .then((registration: ServiceWorkerRegistration) => {
          console.log('SW registered: ', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker: ServiceWorker | null = registration.installing;
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setIsUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((registrationError: Error) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Monitor online/offline status
    const handleOnline = (): void => {
      setIsOnline(true);
      
      // Trigger background sync when back online
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration: ServiceWorkerRegistration) => {
          if ('sync' in registration) {
            return (registration as ServiceWorkerRegistration & { sync: { register: (tag: string) => Promise<void> } }).sync.register('background-sync');
          }
        });
      }
    };

    const handleOffline = (): void => {
      setIsOnline(false);
      router.push('/offline');
      window.location.replace('/offline');
      console.log('User is offline, redirecting to offline page'); // Redirect to offline page if needed
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateServiceWorker = (): void => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations: readonly ServiceWorkerRegistration[]) => {
        registrations.forEach((registration: ServiceWorkerRegistration) => {
          registration.update();
        });
      });
    }
  };

  return {
    isOnline,
    isUpdateAvailable,
    updateServiceWorker,
  };
}