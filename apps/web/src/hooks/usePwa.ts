import { useSyncExternalStore } from 'react';
import { getPwaSnapshot, installPwa, subscribePwa } from '../utils/pwa';

export function usePwa() {
  const snapshot = useSyncExternalStore(subscribePwa, getPwaSnapshot, getPwaSnapshot);

  return {
    ...snapshot,
    install: installPwa
  };
}
