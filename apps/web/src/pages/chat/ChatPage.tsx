import { useEffect, useMemo, useRef, useState } from 'react';
import { AssistantPanel } from '../../components/chat/AssistantPanel/AssistantPanel';
import { MessageArea } from '../../components/chat/MessageArea/MessageArea';
import { ThreadList } from '../../components/chat/ThreadList/ThreadList';
import { DashboardPage } from '../intelligence/DashboardPage';
import { InsightsPage } from '../intelligence/InsightsPage';
import { MemoryPage } from '../intelligence/MemoryPage';
import { RelationshipsPage } from '../intelligence/RelationshipsPage';
import { RelationshipDetailPage } from '../intelligence/RelationshipDetailPage';
import { AutonomySettingsPage } from '../settings/AutonomySettingsPage';
import { ChannelSettingsPage } from '../settings/ChannelSettingsPage';
import { GovernanceSettingsPage } from '../settings/GovernanceSettingsPage';
import { ProfileSettingsPage } from '../settings/ProfileSettingsPage';
import { SettingsPage } from '../settings/SettingsPage';
import { NewConversationPage } from './NewConversationPage';
import { useAuth } from '../../hooks/useAuth';
import { useRoute } from '../../utils/router';

const workspaceGap = 18;
const minLeftWidth = 320;
const minAssistantWidth = 320;
const defaultLeftWidth = 350;
const defaultAssistantWidth = 360;
const maxStoredPanelWidth = 760;
const leftWidthStorageKey = 'murmura.chat.leftWidth';
const assistantWidthStorageKey = 'murmura.chat.assistantWidth';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function readStoredWidth(key: string, fallback: number) {
  const storedValue = window.localStorage.getItem(key);
  const parsedValue = storedValue ? Number.parseInt(storedValue, 10) : Number.NaN;
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

const espaceMurmuraItems = [
  { label: 'Profil', href: '/settings/profile', description: 'Identite, SOUL.md et cadre personnel.' },
  { label: 'Memoire', href: '/intelligence/memory', description: 'Recherche et apercu de la memoire indexee.' },
  { label: 'Relations', href: '/intelligence/relationships', description: 'Vue des liens, tensions et signaux sociaux.' },
  {
    label: 'Pilotage relationnel',
    href: '/intelligence/dashboard',
    description: 'Tableau de bord et pilotage global du jumeau numerique.'
  }
];

const settingsItems = [
  { label: 'General', href: '/settings', description: 'Vue d\'ensemble des parametres.' },
  { label: 'Canaux', href: '/settings/channels', description: 'Connectez WhatsApp, SMS, email et autres canaux.' },
  { label: 'Autonomie', href: '/settings/autonomy', description: 'Controle du niveau d\'autonomie du jumeau numerique.' },
  { label: 'Gouvernance', href: '/settings/governance', description: 'Regles ethiques et limites d\'action.' }
];

function isSpaceRoute(pathname: string) {
  return (
    pathname === '/intelligence' ||
    pathname.startsWith('/intelligence/') ||
    pathname === '/settings/profile' ||
    pathname === '/profile'
  );
}

function isSettingsRoute(pathname: string) {
  return pathname === '/settings' || (pathname.startsWith('/settings/') && pathname !== '/settings/profile');
}

function ThreadListSpaceMenu() {
  const { pathname, navigate } = useRoute();

  return (
    <section className="thread-list-shell thread-panel-shell">
      <div className="thread-list-heading">
        <h2>Espace Murmura</h2>
        <p className="muted" style={{ margin: 0 }}>
          Profil, memoire, relations et pilotage relationnel se pilotent maintenant depuis ce panneau.
        </p>
      </div>

      <div className="thread-space-menu">
        {espaceMurmuraItems.map((item) => (
          <button
            key={item.href}
            type="button"
            className={pathname === item.href ? 'thread-space-link active' : 'thread-space-link'}
            onClick={() => navigate(item.href)}
          >
            <strong>{item.label}</strong>
            <span>{item.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ThreadListSettingsMenu() {
  const { pathname, navigate } = useRoute();
  const { logout } = useAuth();

  return (
    <section className="thread-list-shell thread-panel-shell">
      <div className="thread-list-heading">
        <h2>Parametres</h2>
        <p className="muted" style={{ margin: 0 }}>
          Canaux, autonomie, gouvernance et preferences generales.
        </p>
      </div>

      <div className="thread-space-menu">
        {settingsItems.map((item) => (
          <button
            key={item.href}
            type="button"
            className={pathname === item.href ? 'thread-space-link active' : 'thread-space-link'}
            onClick={() => navigate(item.href)}
          >
            <strong>{item.label}</strong>
            <span>{item.description}</span>
          </button>
        ))}

        <button
          type="button"
          className="thread-logout-button"
          onClick={() => void logout()}
        >
          Se deconnecter
        </button>
      </div>
    </section>
  );
}

export function ChatPage() {
  const { pathname } = useRoute();
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const [leftWidth, setLeftWidth] = useState(() => readStoredWidth(leftWidthStorageKey, defaultLeftWidth));
  const [assistantWidth, setAssistantWidth] = useState(() =>
    readStoredWidth(assistantWidthStorageKey, defaultAssistantWidth)
  );
  const [workspaceWidth, setWorkspaceWidth] = useState(0);

  useEffect(() => {
    if (!workspaceRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      setWorkspaceWidth(entry.contentRect.width);
    });

    observer.observe(workspaceRef.current);
    return () => observer.disconnect();
  }, []);

  const isStackedLayout = workspaceWidth > 0 && workspaceWidth <= 1400;
  const showNewConversationPanel = pathname === '/chat/new';
  const showSpaceMenu = isSpaceRoute(pathname) && !showNewConversationPanel;
  const showSettingsMenu = isSettingsRoute(pathname);

  const maxLeftWidth = useMemo(() => {
    if (!workspaceWidth || isStackedLayout) {
      return maxStoredPanelWidth;
    }

    const usableWidth = workspaceWidth - workspaceGap * 2 - assistantWidth;
    return Math.max(minLeftWidth, Math.floor(usableWidth / 2));
  }, [assistantWidth, isStackedLayout, workspaceWidth]);

  const maxAssistantWidth = useMemo(() => {
    if (!workspaceWidth || isStackedLayout) {
      return maxStoredPanelWidth;
    }

    const usableWidth = workspaceWidth - workspaceGap * 2 - leftWidth;
    return Math.max(minAssistantWidth, Math.floor(usableWidth / 2));
  }, [isStackedLayout, leftWidth, workspaceWidth]);

  useEffect(() => {
    const clampedLeftWidth = clamp(leftWidth, minLeftWidth, maxLeftWidth);
    if (clampedLeftWidth !== leftWidth) {
      setLeftWidth(clampedLeftWidth);
      return;
    }

    window.localStorage.setItem(leftWidthStorageKey, String(leftWidth));
  }, [leftWidth, maxLeftWidth]);

  useEffect(() => {
    const clampedAssistantWidth = clamp(assistantWidth, minAssistantWidth, maxAssistantWidth);
    if (clampedAssistantWidth !== assistantWidth) {
      setAssistantWidth(clampedAssistantWidth);
      return;
    }

    window.localStorage.setItem(assistantWidthStorageKey, String(assistantWidth));
  }, [assistantWidth, maxAssistantWidth]);

  const handleLeftResizeStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (isStackedLayout) {
      return;
    }

    event.preventDefault();
    const startX = event.clientX;
    const initialWidth = leftWidth;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const nextWidth = clamp(initialWidth + deltaX, minLeftWidth, maxLeftWidth);
      setLeftWidth(nextWidth);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleRightResizeStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (isStackedLayout) {
      return;
    }

    event.preventDefault();
    const startX = event.clientX;
    const initialWidth = assistantWidth;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = startX - moveEvent.clientX;
      const nextWidth = clamp(initialWidth + deltaX, minAssistantWidth, maxAssistantWidth);
      setAssistantWidth(nextWidth);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const leftPanel = showNewConversationPanel ? (
    <NewConversationPage embedded />
  ) : showSettingsMenu ? (
    <ThreadListSettingsMenu />
  ) : showSpaceMenu ? (
    <ThreadListSpaceMenu />
  ) : (
    <ThreadList />
  );

  const mainPanel =
    pathname === '/intelligence' || pathname === '/intelligence/dashboard' ? (
      <DashboardPage />
    ) : pathname === '/intelligence/memory' ? (
      <MemoryPage />
    ) : pathname === '/intelligence/relationships' ? (
      <RelationshipsPage />
    ) : pathname.startsWith('/intelligence/relationships/') ? (
      <RelationshipDetailPage />
    ) : pathname === '/intelligence/insights' ? (
      <InsightsPage />
    ) : pathname === '/settings/profile' || pathname === '/profile' ? (
      <ProfileSettingsPage />
    ) : pathname === '/settings' ? (
      <SettingsPage />
    ) : pathname === '/settings/channels' ? (
      <ChannelSettingsPage />
    ) : pathname === '/settings/autonomy' ? (
      <AutonomySettingsPage />
    ) : pathname === '/settings/governance' ? (
      <GovernanceSettingsPage />
    ) : (
      <MessageArea />
    );

  return (
    <div
      ref={workspaceRef}
      className="chat-workspace"
      style={
        isStackedLayout
          ? undefined
          : {
              gridTemplateColumns: `${leftWidth}px minmax(0, 1fr) ${assistantWidth}px`
            }
      }
    >
      <section className="chat-column thread-list-column resizable-panel">
        <button
          type="button"
          className="left-resize-handle"
          aria-label="Redimensionner le panneau gauche"
          title="Redimensionner le panneau gauche"
          onPointerDown={handleLeftResizeStart}
        >
          <span />
          <span />
        </button>
        {leftPanel}
      </section>

      <section className="chat-column chat-main-column">
        {mainPanel}
      </section>

      <section className="chat-column chat-assistant-panel resizable-panel">
        <button
          type="button"
          className="assistant-resize-handle"
          aria-label="Redimensionner le panneau droit"
          title="Redimensionner le panneau droit"
          onPointerDown={handleRightResizeStart}
        >
          <span />
          <span />
        </button>
        <AssistantPanel />
      </section>
    </div>
  );
}
