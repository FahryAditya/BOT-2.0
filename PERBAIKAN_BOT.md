# Perbaikan Bot WhatsApp (Anime Bot)

Dokumen ini merangkum masalah yang teridentifikasi dan rencana perbaikan untuk memastikan bot berjalan stabil dan semua command dapat dieksekusi.

---

## 1. Masalah Intermiten (Error saat memproses command)
**Penyebab:**
Handler command tidak menangani kondisi ketika `userStats.getUser()` mengembalikan `null` (karena kegagalan database atau timeout), menyebabkan error *Unhandled Promise Rejection* ("Cannot read property of null").

**Rencana Perbaikan:**
- Menambahkan validasi `if (!stats)` di setiap handler command dalam `commands/specialFeatures2.js` dan file lainnya yang menggunakan `userStats`.
- Jika `stats` bernilai `null`, bot akan membalas dengan pesan error yang informatif kepada user alih-alih crash.

---

## 2. Masalah Command Tidak Terbaca (`!shiritori`, `!slot`, dll.)
**Penyebab:**
Struktur `switch` case di `messageHandler.js` bersifat statis dan tidak mencakup semua fungsi yang tersedia di `gamesCommands.js` dan `newGames.js`. Command yang tidak ada di `switch` tidak akan pernah dieksekusi.

**Rencana Perbaikan:**
- Mengganti `switch` case besar di `messageHandler.js` dengan sistem rute dinamis (dynamic lookup).
- Sistem akan mencari fungsi berdasarkan nama command di objek `gamesCommands`, `newGames`, dan `specialFeatures2` secara otomatis.

**Contoh Rencana Implementasi:**
```javascript
// Di messageHandler.js, ganti switch case dengan:
const commandHandlers = { ...gamesCommands, ...newGames, ...specialFeatures2 };

if (commandHandlers[command]) {
    await commandHandlers[command](message, args);
} else {
    // Fallback jika tidak ditemukan
}
```

---

## 3. Masalah Port Konflik & Browser Lock
**Penyebab:**
Bot mencoba menggunakan port 8080 yang sudah dipakai, dan file session terkunci karena proses bot sebelumnya tidak dimatikan dengan benar.

**Rencana Perbaikan:**
- Menambahkan prosedur *Graceful Shutdown* yang lebih tangguh untuk menutup browser client.
- Menambahkan deteksi proses sebelum menjalankan bot untuk memastikan port 8080 dan file session dalam keadaan bersih (sudah diotomatisasi melalui `npm run fresh`).

---

## 4. Masalah Umum Lainnya
- **Token WhatsApp Kedaluwarsa:** Sesi WhatsApp sering kali perlu diperbarui jika bot tidak aktif dalam waktu lama atau ada perubahan pada perangkat tertaut.
  - *Solusi:* Memperkuat logika `auth_failure` dan pembersihan sesi otomatis jika autentikasi gagal berulang kali.
- **Koneksi Database Timeout:** Database Neon/PostgreSQL terkadang mengalami *idle timeout* jika tidak ada aktivitas dalam durasi tertentu.
  - *Solusi:* Menggunakan *connection pooling* yang lebih tangguh dan menambahkan mekanisme *retry* pada koneksi database.
- **Konflik Dependensi:** Masalah pada `whatsapp-web.js` akibat perubahan struktur web WhatsApp.
  - *Solusi:* Memastikan `webVersionCache` selalu merujuk ke versi yang stabil dan mendokumentasikan prosedur upgrade dependensi.
- **Keterbatasan Memori/Resource:** Bot sering crash di *hosting* gratis karena batasan RAM (saat menjalankan banyak proses puppeteer).
  - *Solusi:* Mengoptimalkan argumen `puppeteer` dan membatasi jumlah *background task* (scheduler/interval).

1. Memperbarui `messageHandler.js` dengan rute dinamis.
2. Memperbarui `commands/specialFeatures2.js` dengan validasi `stats` yang lebih ketat.
3. Melakukan pengujian ulang untuk command yang sebelumnya error dan command yang tidak terbaca.
