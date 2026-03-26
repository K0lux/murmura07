import { useContext } from 'react';
import { NotificationContext } from '../providers/notification.provider';

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }

  return {
    ...context,
    unreadAlerts: context.notifications.filter((item) => item.level !== 'info').length
  };
}
