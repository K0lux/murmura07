import { useSyncExternalStore } from 'react';

function subscribe(onStoreChange: () => void) {
  window.addEventListener('popstate', onStoreChange);
  return () => window.removeEventListener('popstate', onStoreChange);
}

function getSnapshot() {
  return window.location.pathname;
}

export function navigate(to: string) {
  if (window.location.pathname === to) {
    return;
  }

  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function useRoute() {
  const pathname = useSyncExternalStore(subscribe, getSnapshot, () => '/');

  return {
    pathname,
    navigate
  };
}
