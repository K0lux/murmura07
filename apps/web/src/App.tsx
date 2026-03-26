import { useEffect } from 'react';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AppLayout } from './components/layout/AppLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ChatPage } from './pages/chat/ChatPage';
import { ThreadPage } from './pages/chat/ThreadPage';
import { InsightsPage } from './pages/intelligence/InsightsPage';
import { AutonomySettingsPage } from './pages/settings/AutonomySettingsPage';
import { ChannelSettingsPage } from './pages/settings/ChannelSettingsPage';
import { GovernanceSettingsPage } from './pages/settings/GovernanceSettingsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useAuth } from './hooks/useAuth';
import { useRoute } from './utils/router';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const { pathname, navigate } = useRoute();

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/login') {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, pathname]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
}

function AppRouter() {
  const { pathname, navigate } = useRoute();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate, pathname]);

  if (pathname === '/login') {
    if (isAuthenticated) {
      return null;
    }

    return (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    );
  }

  if (pathname === '/register') {
    if (isAuthenticated) {
      return null;
    }

    return (
      <AuthLayout>
        <RegisterPage />
      </AuthLayout>
    );
  }

  const isRelationshipDetail = pathname.startsWith('/intelligence/relationships/');
  const isThreadDetail = pathname.startsWith('/chat/thread/');

  let content: JSX.Element;

  if (pathname === '/' || pathname === '/chat') {
    content = <ChatPage />;
  } else if (isThreadDetail) {
    content = <ThreadPage />;
  } else if (pathname === '/chat/new') {
    content = <ChatPage />;
  } else if (
    pathname === '/intelligence' ||
    pathname === '/intelligence/dashboard' ||
    pathname === '/intelligence/relationships' ||
    pathname === '/intelligence/memory' ||
    pathname === '/profile' ||
    pathname === '/settings/profile'
  ) {
    content = <ChatPage />;
  } else if (isRelationshipDetail) {
    content = <ChatPage />;
  } else if (pathname === '/intelligence/insights') {
    content = <InsightsPage />;
  } else if (pathname === '/settings') {
    content = <SettingsPage />;
  } else if (pathname === '/settings/channels') {
    content = <ChannelSettingsPage />;
  } else if (pathname === '/settings/autonomy') {
    content = <AutonomySettingsPage />;
  } else if (pathname === '/settings/governance') {
    content = <GovernanceSettingsPage />;
  } else {
    content = <NotFoundPage />;
  }

  return (
    <ProtectedRoute>
      <AppLayout>{content}</AppLayout>
    </ProtectedRoute>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
}
