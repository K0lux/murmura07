type DeferredInstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

type PwaSnapshot = {
  canInstall: boolean;
  isOffline: boolean;
};

let installPromptEvent: DeferredInstallPrompt | null = null;
const listeners = new Set<() => void>();
let currentSnapshot: PwaSnapshot = {
  canInstall: false,
  isOffline: false
};

function computeSnapshot(): PwaSnapshot {
  return {
    canInstall: installPromptEvent !== null,
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false
  };
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function updateSnapshot() {
  const nextSnapshot = computeSnapshot();
  if (
    nextSnapshot.canInstall === currentSnapshot.canInstall &&
    nextSnapshot.isOffline === currentSnapshot.isOffline
  ) {
    return;
  }

  currentSnapshot = nextSnapshot;
  notifyListeners();
}

export function registerServiceWorker() {
  currentSnapshot = computeSnapshot();

  if (!('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registration failed', error);
    });
  });

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPromptEvent = event as DeferredInstallPrompt;
    updateSnapshot();
  });

  window.addEventListener('appinstalled', () => {
    installPromptEvent = null;
    updateSnapshot();
  });

  window.addEventListener('online', updateSnapshot);
  window.addEventListener('offline', updateSnapshot);
}

export function subscribePwa(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPwaSnapshot() {
  return currentSnapshot;
}

export async function installPwa() {
  if (!installPromptEvent) {
    return false;
  }

  await installPromptEvent.prompt();
  const choice = await installPromptEvent.userChoice;
  installPromptEvent = null;
  updateSnapshot();
  return choice.outcome === 'accepted';
}
