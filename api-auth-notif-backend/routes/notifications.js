import { Router } from 'express';
import { pool } from '../db.js';
import { wajibLogin } from '../middleware/auth.js';
import { kirimExpoPush } from '../services/pushService.js';

const router = Router();

// 1. Endpoint untuk menyimpan Push Token ke database
router.post('/token', wajibLogin, async (req, res) => {
  try {
    const { expoPushToken } = req.body;
    if (!expoPushToken || !expoPushToken.startsWith('Expo')) {
      return res.status(400).json({ pesan: 'push token tidak valid' });
    }

    await pool.query(
      `INSERT INTO push_tokens (user_id, expo_push_token)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE
       user_id = VALUES(user_id),
       diperbarui_pada = CURRENT_TIMESTAMP`,
      [req.user.sub, expoPushToken]
    );

    console.log(`==> Push Token tersimpan untuk User ID: ${req.user.sub}`);
    res.status(201).json({ pesan: 'push token tersimpan' });
  } catch (error) {
    console.error('Error simpan token:', error.message);
    res.status(500).json({ pesan: 'Gagal menyimpan push token di server' });
  }
});

// 2. Endpoint untuk uji coba kirim notifikasi (Sesuai modul Langkah 27)
router.post('/test', wajibLogin, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT expo_push_token
     FROM push_tokens
     WHERE user_id = ?
     ORDER BY diperbarui_pada DESC`,
    [req.user.sub]
  );

  if (rows.length === 0) {
    return res.status(404).json({
      pesan: 'perangkat belum mendaftarkan push token',
    });
  }

  const hasil = [];

  for (const row of rows) {
    const ticket = await kirimExpoPush(row.expo_push_token, {
      title: 'Praktikum Pemrograman Mobile',
      body: 'Login JWT dan push notification berhasil.',
      data: { screen: 'profile' },
    });
    hasil.push(ticket);
  }

  res.json({ pesan: 'notifikasi dikirim', hasil });
});

export default router;