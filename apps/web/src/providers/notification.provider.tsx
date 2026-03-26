import { createContext, useMemo, useState, type ReactNode } from 'react';

type Notification = {
  id: string;
  title: string;
  level: 'info' | 'warning' | 'critical';
};

type NotificationContextValue = {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  dismiss: (id: string) => void;
};

export const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Suggestion a valider pour Lea', level: 'info' }
  ]);

  const value = useMemo(
    () => ({
      notifications,
      addNotification: (notification: Notification) =>
        setNotifications((current) => [notification, ...current]),
      dismiss: (id: string) =>
        setNotifications((current) => current.filter((item) => item.id !== id))
    }),
    [notifications]
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}
