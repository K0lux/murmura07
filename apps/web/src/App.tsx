import { useEffect } from 'react';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AppLayout } from './components/layout/AppLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ChatPage } from './pages/chat/ChatPage';
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

  const isChatOrApp =
    pathname === '/' ||
    pathname.startsWith('/chat') ||
    pathname.startsWith('/intelligence') ||
    pathname.startsWith('/settings') ||
    pathname === '/profile';

  const content = isChatOrApp ? <ChatPage /> : <NotFoundPage />;

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
