import { View, Text, Button, StyleSheet } from 'react-native';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { getExpoPushToken } from '../../utils/notifications';
import { simpanPushToken, kirimNotifikasiUji } from '../../services/notificationService';

export default function HomeScreen() {
  const { user, token, signOut } = useAuth();

  async function aktifkanNotifikasi() {
    try {
      const expoPushToken = await getExpoPushToken();
      await simpanPushToken(token, expoPushToken);
      Alert.alert('Berhasil', 'Perangkat terdaftar untuk notifikasi');
    } catch (e) {
      Alert.alert('Notifikasi', e.message);
    }
  }

  async function testNotifikasi() {
    try {
      const data = await kirimNotifikasiUji(token);
      Alert.alert('Server', data.pesan);
    } catch (e) {
      Alert.alert('Gagal', e.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Halo, {user?.nama}</Text>
      <Text>Anda sudah login menggunakan JWT.</Text>

      {/* Tombol fitur notifikasi */}
      <Button title="Aktifkan Notifikasi" onPress={aktifkanNotifikasi} />
      <Button title="Kirim Notifikasi Uji" onPress={testNotifikasi} />

      {/* Tombol navigasi dan aksi akun */}
      <Button title="Lihat Profil" onPress={() => router.push('/profile')} />
      <Button title="Logout" onPress={signOut} color="#ff3b30" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    justifyContent: 'center', 
    gap: 16,
    backgroundColor: '#fff',
  },
  title: { 
    fontSize: 26, 
    fontWeight: '700' 
  },
});