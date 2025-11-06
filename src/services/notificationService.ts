// src/services/notificationService.ts

const NOTIFICATION_TAG = 'pericia-prazo-notification';

/**
 * Checks if the browser supports notifications.
 */
function isSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Requests permission from the user to show notifications.
 * @returns A promise that resolves with the permission status ('granted', 'denied', or 'default').
 */
async function requestPermission(): Promise<NotificationPermission> {
  if (!isSupported()) {
    console.warn('Browser does not support notifications.');
    return 'denied';
  }
  return Notification.requestPermission();
}

/**
 * Displays a browser notification.
 * @param title The title of the notification.
 * @param options The notification options (body, icon, etc.).
 */
function showNotification(title: string, options: NotificationOptions): void {
  if (!isSupported() || Notification.permission !== 'granted') {
    return;
  }

  // Using a tag ensures that similar notifications replace each other instead of stacking up.
  new Notification(title, { ...options, tag: NOTIFICATION_TAG });
}

export const notificationService = {
  isSupported,
  requestPermission,
  showNotification,
};
