import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import * as Notifications from 'expo-notifications';

export default function AppLayout() {
  useEffect(() => {
    // Listener saat notifikasi diterima saat aplikasi sedang aktif di foreground
    const received = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notifikasi diterima:', notification.request.content);
      }
    );

    // Listener saat notifikasi diketuk oleh pengguna
    const response = Notifications.addNotificationResponseReceivedListener(
      (event) => {
        const screen = event.notification.request.content.data?.screen;
        if (screen === 'profile') {
          router.push('/profile');
        }
      }
    );

    // Membersihkan listener saat komponen dilepas (unmount)
    return () => {
      received.remove();
      response.remove();
    };
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Beranda' }} />
      <Stack.Screen name="profile" options={{ title: 'Profil' }} />
    </Stack>
  );
}