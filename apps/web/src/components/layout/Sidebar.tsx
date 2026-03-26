import { type ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { useRoute } from '../../utils/router';

type SidebarEntry = {
  label: string;
  href: string;
  badge?: number;
};

const messagingEntry: SidebarEntry = {
  label: 'Messages',
  href: '/chat'
};

const espaceMurmuraEntry: SidebarEntry = {
  label: 'Espace Murmura',
  href: '/intelligence/dashboard'
};

const settingsEntry: SidebarEntry = {
  label: 'Parametres',
  href: '/settings'
};

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 6.5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9.5l-4.5 3v-3H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function MurmuraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.5 14.7 9l5.8.8-4.2 4.1 1 5.8L12 17l-5.3 2.7 1-5.8L3.5 9.8 9.3 9 12 3.5Z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm8 3.5-.9-.3a7.7 7.7 0 0 0-.6-1.5l.5-.8a1 1 0 0 0-.1-1.2l-1.5-1.5a1 1 0 0 0-1.2-.1l-.8.5a7.7 7.7 0 0 0-1.5-.6L13.9 4a1 1 0 0 0-1-.8h-1.8a1 1 0 0 0-1 .8l-.3.9a7.7 7.7 0 0 0-1.5.6l-.8-.5a1 1 0 0 0-1.2.1L5 6.6a1 1 0 0 0-.1 1.2l.5.8a7.7 7.7 0 0 0-.6 1.5l-.9.3a1 1 0 0 0-.8 1v1.8a1 1 0 0 0 .8 1l.9.3a7.7 7.7 0 0 0 .6 1.5l-.5.8a1 1 0 0 0 .1 1.2l1.5 1.5a1 1 0 0 0 1.2.1l.8-.5a7.7 7.7 0 0 0 1.5.6l.3.9a1 1 0 0 0 1 .8h1.8a1 1 0 0 0 1-.8l.3-.9a7.7 7.7 0 0 0 1.5-.6l.8.5a1 1 0 0 0 1.2-.1l1.5-1.5a1 1 0 0 0 .1-1.2l-.5-.8a7.7 7.7 0 0 0 .6-1.5l.9-.3a1 1 0 0 0 .8-1v-1.8a1 1 0 0 0-.8-1Z" />
    </svg>
  );
}

function isEntryActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarIconButton({
  active,
  badge,
  label,
  onClick,
  children
}: {
  active: boolean;
  badge?: number;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={active ? 'sidebar-icon-button active' : 'sidebar-icon-button'}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      <span className="sidebar-icon-glyph">{children}</span>
      {badge && badge > 0 ? <span className="sidebar-icon-badge">{badge > 9 ? '9+' : badge}</span> : null}
    </button>
  );
}

export function Sidebar() {
  const { user } = useAuth();
  const { unreadAlerts } = useNotifications();
  const { pathname, navigate } = useRoute();
  const inMurmuraSpace =
    pathname === '/intelligence' ||
    pathname.startsWith('/intelligence/') ||
    pathname === '/settings/profile' ||
    pathname === '/profile';

  return (
    <aside className="sidebar">
      <div className="sidebar-panel sidebar-icon-panel">
        <div className="sidebar-brand-stack">
          <button
            type="button"
            className="sidebar-brand-button"
            onClick={() => navigate('/chat')}
            title="Murmura"
            aria-label="Murmura"
          >
            <span className="sidebar-brand-mark">M</span>
          </button>
        </div>

        <div className="sidebar-icon-group">
          <SidebarIconButton
            active={isEntryActive(pathname, messagingEntry.href)}
            badge={unreadAlerts}
            label={messagingEntry.label}
            onClick={() => {
              navigate(messagingEntry.href);
            }}
          >
            <MessageIcon />
          </SidebarIconButton>

          <SidebarIconButton
            active={inMurmuraSpace}
            label={espaceMurmuraEntry.label}
            onClick={() => navigate(espaceMurmuraEntry.href)}
          >
            <MurmuraIcon />
          </SidebarIconButton>
        </div>

        <div className="sidebar-footer-stack">
          <SidebarIconButton
            active={isEntryActive(pathname, settingsEntry.href)}
            label={settingsEntry.label}
            onClick={() => navigate(settingsEntry.href)}
          >
            <SettingsIcon />
          </SidebarIconButton>

          <button
            type="button"
            className="sidebar-profile-button"
            onClick={() => {
              navigate('/settings/profile');
            }}
            title={user?.name ?? 'Profil'}
            aria-label={user?.name ?? 'Profil'}
          >
            <span className="sidebar-profile-avatar">{(user?.name ?? 'M').slice(0, 1).toUpperCase()}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
