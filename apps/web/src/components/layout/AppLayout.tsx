import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { InstallPrompt } from '../pwa/InstallPrompt';
import { useRoute } from '../../utils/router';

export function AppLayout({ children }: { children: ReactNode }) {
  const { pathname } = useRoute();
  const isChatRoute = pathname === '/chat' || pathname.startsWith('/chat/');

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main-shell">
        {isChatRoute ? null : <TopBar />}
        <InstallPrompt />
        <main className={isChatRoute ? 'content content-chat' : 'content'}>{children}</main>
      </div>
    </div>
  );
}
