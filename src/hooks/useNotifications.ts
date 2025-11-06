// src/hooks/useNotifications.ts
import { useEffect } from 'react';
import { usePericias } from '../context/PericiasContext';
import { notificationService } from '../services/notificationService';

// Check for notifications every 5 minutes
const NOTIFICATION_CHECK_INTERVAL = 5 * 60 * 1000;
const LAST_CHECK_KEY = 'last_notification_check';

export function useNotifications() {
  const { prazos7Dias, prazos15Dias } = usePericias();

  useEffect(() => {
    // 1. Request permission as soon as the app loads, if not already granted/denied.
    if (notificationService.isSupported() && Notification.permission === 'default') {
      notificationService.requestPermission();
    }

    // 2. Set up an interval to periodically check for deadlines.
    const intervalId = setInterval(checkAndNotify, NOTIFICATION_CHECK_INTERVAL);

    // 3. Perform an initial check on load.
    checkAndNotify();

    // 4. Clean up the interval when the component unmounts.
    return () => clearInterval(intervalId);
  }, [prazos7Dias, prazos15Dias]); // Rerun if the deadlines data changes

  const checkAndNotify = () => {
    // To prevent spamming users, we'll only show a summary notification once per day.
    const now = new Date().getTime();
    const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
    const oneDay = 24 * 60 * 60 * 1000;

    if (lastCheck && now - parseInt(lastCheck, 10) < oneDay) {
      // It hasn't been a full day since the last notification summary.
      return;
    }

    if (!notificationService.isSupported() || Notification.permission !== 'granted') {
      return;
    }

    const totalPrazosProximos = prazos7Dias.length + prazos15Dias.length;

    if (totalPrazosProximos > 0) {
      let body = '';
      if (prazos7Dias.length > 0) {
        body += `${prazos7Dias.length} perícia(s) com prazo em até 7 dias.\n`;
      }
      if (prazos15Dias.length > 0) {
        body += `${prazos15Dias.length} perícia(s) com prazo em até 15 dias.`;
      }

      notificationService.showNotification(
        '🗓️ Lembrete de Prazos',
        {
          body: body.trim(),
          icon: '/favicon.ico', // Optional: Add an icon for the notification
        }
      );

      // Update the timestamp of the last notification check.
      localStorage.setItem(LAST_CHECK_KEY, now.toString());
    }
  };
}
