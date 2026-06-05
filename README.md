# 🎌 Anime WhatsApp Bot

Bot WhatsApp dengan fitur anime lengkap, absurd, dan waifu!

## 📁 Struktur Folder

```
anime-whatsapp-bot/
├── commands/
│   ├── basicCommands.js
│   ├── animeCommands.js
│   ├── absurdCommands.js
│   └── waifuCommands.js
├── session/                 (akan dibuat otomatis)
├── node_modules/           (akan dibuat setelah npm install)
├── index.js
├── config.js
├── helpers.js
├── apiService.js
├── absurdData.js
├── messageHandler.js
├── package.json
├── .gitignore
└── README.md
```

## 🚀 Cara Instalasi

### 1. Persiapan

Pastikan sudah menginstall:
- **Node.js** (versi 14 atau lebih baru)
- **npm** (biasanya sudah include dengan Node.js)

### 2. Setup Project

```bash
# Buat folder project
mkdir anime-whatsapp-bot
cd anime-whatsapp-bot

# Buat folder commands
mkdir commands

# Copy semua file yang sudah dibuat ke folder yang sesuai
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Jalankan Bot

```bash
npm start
```

atau

```bash
node index.js
```

### 5. Scan QR Code

- Setelah bot berjalan, QR code akan muncul di terminal
- Buka WhatsApp di HP → Settings → Linked Devices → Link a Device
- Scan QR code yang muncul
- Tunggu hingga muncul pesan "✅ Bot sudah siap!"

## 📱 Daftar Command

### Fitur Dasar
- `!ping` - Cek bot aktif
- `!menu` - Tampilkan menu

### Fitur Anime
- `!manga <judul>` - Info manga
- `!animechar <nama>` - Info karakter anime
- `!seasonnow` - Anime musim ini (top 5)
- `!topanime` - Top 5 anime terbaik
- `!topmanga` - Top 5 manga terbaik

### Fitur Absurd
- `!animememe` - Meme anime random
- `!animefact` - Fakta lucu/absurd anime
- `!animeweirdchar` - Karakter + quote absurd
- `!guessanime` - Tebak anime dari deskripsi
- `!animeemoji` - Emoji anime
- `!animevs` - Battle absurd 2 karakter
- `!animeghost` - Cerita horor absurd
- `!animerandomquote` - Quote absurd random
- `!animefood` - Makanan favorit absurd
- `!animepet` - Karakter jadi hewan

### Fitur Waifu
- `!cariwaifu <nama>` - Cari waifu spesifik
- `!randomwaifu` - Waifu random
- `!waifuquiz` - Quiz tebak waifu

### Fitur Tambahan
- `!otakudesu` - Rekomendasi anime by mood

## ⚙️ Konfigurasi

Edit file `config.js` untuk mengubah:
- Prefix command (default: `!`)
- Nama bot
- Welcome message

## 🔧 Troubleshooting

### Bot tidak merespon
- Pastikan prefix benar (default: `!`)
- Cek koneksi internet
- Restart bot

### QR Code tidak muncul
- Pastikan dependencies terinstall lengkap
- Cek versi Node.js (minimal v14)

### Error saat install
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
```

## 📝 Catatan

- Bot akan otomatis menyimpan session di folder `session/`
- Setelah scan QR pertama kali, bot akan login otomatis di run berikutnya
- Jangan hapus folder `session/` jika tidak ingin scan QR lagi
- Bot akan welcome member baru di grup secara otomatis

## 🎯 Fitur Mendatang

- [ ] Database untuk menyimpan quiz answers
- [ ] Custom welcome message per grup
- [ ] Anime recommendation berdasarkan genre
- [ ] Leaderboard quiz
- [ ] Admin commands

## 📄 License

MIT License

## 🤝 Kontribusi

Feel free to contribute! Pull requests are welcome.

---

Dibuat dengan ❤️ untuk para wibu# BOT-2.0
"# BOT-2.0" 
