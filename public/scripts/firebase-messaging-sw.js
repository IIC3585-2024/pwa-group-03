import { getMessaging } from 'firebase/messaging/sw';

const messaging = getMessaging();

// Escucha las notificaciones push y maneja su contenido
messaging.onBackgroundMessage((payload) => {
  console.log('Background notification received:', payload);
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
