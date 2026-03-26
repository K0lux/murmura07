import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from './providers/auth.provider';
import { NotificationProvider } from './providers/notification.provider';
import { QueryProvider } from './providers/query.provider';
import { ThemeProvider } from './providers/theme.provider';
import { WebSocketProvider } from './providers/websocket.provider';
import { registerServiceWorker } from './utils/pwa';
import './styles.css';

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <WebSocketProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </WebSocketProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  </React.StrictMode>
);
