# 🎌 Katalog Fitur Lengkap Anime WhatsApp Bot 🎌
Nama bot : Anthropic Bot
Dokumen ini adalah panduan referensi terlengkap untuk seluruh fitur, command, dan sistem yang ada di dalam bot ini.

---

## 📋 1. FITUR DASAR & UTILITY (CORE)
Command esensial untuk interaksi dan bantuan.
- `!ping` - Mengecek latensi dan status bot (Respon: Pong! + Kecepatan ms).
- `!menu [1/2/3]` - Menampilkan menu fitur berdasarkan kategori.
- `!tagall` - Mention seluruh anggota grup (Khusus Admin/Grup).
- `!afk [alasan]` - Mengaktifkan mode AFK. Bot akan membalas otomatis jika kamu di-mention saat sedang AFK.
- `!profile` - Cek profil singkat dari database lokal.
- `!setprofile [nama]` - Mengatur nama profil kamu di bot.

---

## 📸 2. MEDIA & CREATIVE
Tools untuk mengolah gambar dan video.
- `!sticker [judul]` / `!stiker` - Mengubah gambar menjadi stiker. Opsional: Tambahkan judul setelah command.
- `!gif [teks/none]` - Mengubah video (durasi < 10 detik) menjadi stiker bergerak. Opsional: Tambahkan teks untuk caption atau 'none' untuk tanpa teks.

---

## 🎌 3. ANIME & MANGA DISCOVERY (JIKAN API)
Fitur pencarian dan informasi mendalam seputar anime/manga.
- `!manga <judul>` - Informasi detail manga (Sinopsis, Skor, Status, Chapter).
- `!animechar <nama>` - Informasi karakter anime (Deskripsi, Favorites, Foto).
- `!seasonnow` - Daftar Top 5 anime yang sedang tayang musim ini.
- `!topanime` - Daftar 5 anime dengan skor tertinggi sepanjang masa.
- `!topmanga` - Daftar 5 manga dengan skor tertinggi sepanjang masa.
- `!detectanime` - (Reply gambar) Mendeteksi judul anime, episode, dan timestamp berdasarkan screenshot (Trace.moe).
- `!animenews` - Berita terbaru dunia anime dari MyAnimeList.

---

## 🎭 4. GENRE EXPLORER
- `!animegenre` - Menampilkan daftar lengkap genre anime berserta ID-nya.
- `!searchgenre <nama_genre>` - Mencari 10 anime terbaik berdasarkan genre tertentu.
- `!randomgenre` - Mendapatkan rekomendasi genre acak untuk dieksplorasi.

---

## 🎲 5. GAMES & KUIS (INTERAKTIF)
Sistem permainan canggih dengan reward poin.

### 🧠 Kuis Pengetahuan
- `!tebakanime` - Menebak judul anime dari petunjuk/clue.
- `!tebakgambar` - Menebak judul anime dari susunan emoji.
- `!guessthecharacter` - Menebak karakter dari deskripsi singkat.
- `!mangaquiz` - Kuis seputar pengarang dan fakta manga.
- `!openingquiz` - Menebak judul lagu opening dari anime (Fokus anime 2020+).
- `!shiritori` - Game sambung kata (huruf terakhir jadi huruf depan kata baru).
- `!emojiriddles` - Teka-teki judul anime dalam bentuk rangkaian emoji.
- `!scramble` - Menyusun kembali nama karakter yang hurufnya diacak.
- `!guessscene` - Menebak anime dari deskripsi adegan kunci.
- `!hangman` - Game hangman bertema anime (menebak huruf).
- `!hitung` - Kuis matematika (Penjumlahan, Pengurangan, Perkalian).

### 🎰 Game Keberuntungan & Seru
- `!spinwaifu` / `!spainwaifu` - Gacha waifu acak (Hasil menampilkan nama, foto, dan raritas bintang).
- `!slot` - Mesin slot dengan taruhan 20 poin (Hadiah hingga 500 poin).
- `!dadu` - Melempar dadu (1-6).
- `!flipcoin` - Lempar koin (Kepala atau Ekor).
- `!suwit <gunting/batu/kertas>` - Bermain suwit melawan bot (Menang +50 poin, Kalah -20 poin).
- `!wish` - Gacha poin (Kesempatan Super Rare +1000 poin).
- `!animerate <judul>` - Memberikan rating 1-10 secara acak untuk anime tertentu.
- `!waifucompat <nama>` - Mengecek persentase kecocokan kamu dengan seseorang/waifu.

---

## 💰 6. EKONOMI & RPG SYSTEM
Sistem progres karakter dan kekayaan.
- `!rank` - Kartu profil lengkap (Level, EXP, Poin, Bank, HP, Bio, Pasangan, Pet).
- `!daily` - Klaim hadiah harian (Cooldown 24 jam).
- `!work` - Bekerja dengan gaji acak (Karyawan, Dev, dll). Cooldown 1 jam.
- `!bank` - Informasi saldo tunai dan tabungan di bank.
- `!deposit <jumlah/all>` - Menabung poin ke bank.
- `!withdraw <jumlah/all>` - Menarik poin dari bank ke dompet.
- `!shop` - Daftar item yang bisa dibeli (Pet, Sword, Potion, Ring).
- `!buy <nama/nomor>` - Membeli item dari toko.
- `!upgrade <nama_item>` - Mengupgrade senjata (Contoh: Wooden Sword -> Iron Sword -> Katana -> Muramasa).
- `!heal` - Memulihkan HP sampai penuh (Cooldown 10 menit).
- `!inventory` - Melihat daftar item yang kamu miliki.
- `!leaderboardglobal` - Daftar 10 besar user terkaya di seluruh database bot.
- `!setbio <teks>` - Mengatur bio singkat di profil (Max 50 karakter).

---

## 💍 7. SOSIAL & INTERAKSI USER
- `!marry <@tag>` - Melamar anggota grup lain untuk menjadi pasangan resmi.
- `!divorce` - Mengakhiri pernikahan (Menghapus status pasangan di profil).
- `!marrylist` - Daftar 10 pasangan terakhir yang menikah lewat bot.
- `!steal <@tag>` - Mencoba mencuri poin user lain (Sukses 40%).
- `!duel <@tag> [taruhan]` - Menantang duel 1vs1. Pemenang mengambil taruhan poin.
- `!give <@tag> <jumlah>` - Mentransfer poin ke user lain secara langsung.
- `!git <jumlah> @tag` - Memberikan hadiah poin ke satu orang.
- `!git <jumlah> !tagall` - Memberikan hadiah poin ke SELURUH anggota grup (Biaya ditanggung pengirim).

---

## 🐾 8. PET SYSTEM
- `!pet` - Melihat status hewan peliharaan (Nama, Level, Hunger, Health).
- `!feed` - Memberi makan pet (+20 Hunger, biaya 50 poin).
- `!setpetname <nama>` - Mengganti nama pet kamu (Max 15 karakter).
- `!waifusafari` - Berburu waifu di zona safari untuk mendapatkan poin besar (Cooldown 4 jam).

---

## 🔮 9. FITUR ABSURD & FUN
- `!animememe` - Menampilkan meme anime secara acak.
- `!animefact` - Fakta-fakta unik dan aneh seputar anime.
- `!animeweirdchar` - Karakter anime dengan sifat atau desain paling aneh.
- `!animeemoji` - Tebak anime lewat satu emoji.
- `!animevs` - Simulasi pertarungan konyol antar karakter.
- `!animeghost` - Cerita horor/creepypasta versi anime.
- `!animerandomquote` - Kutipan acak dari berbagai anime.
- `!animefood` - Informasi makanan favorit karakter anime yang unik.
- `!animepet` - Imajinasi jika karakter anime menjadi hewan.
- `!otakudesu` - Rekomendasi anime berdasarkan mood kamu hari ini.

---

## 🤖 10. ARTIFICIAL INTELLIGENCE (AI)
- `!ai <pertanyaan>` - Bertanya apapun pada bot (Powered by Google Gemini AI). Bot akan menjawab pertanyaan seputar anime dan umum secara singkat dan cerdas.

---

## 🛡️ 11. SISTEM OTOMATIS & ADMIN
- **Welcome Message**: Menyapa otomatis member baru yang bergabung dengan kartu intro dan aturan grup.
- **Auto-Update (Scheduled)**:
  - 06:00 WIB: Ucapan Selamat Pagi (Grup Khusus/Owner).
  - 08:00 WIB: Random Character Update.
  - 14:00 WIB: Random Anime Update.
  - 19:00 WIB: Top Manga Update.
  - 22:00 WIB: Ucapan Selamat Malam.
- **Admin Secret Commands**:
  - `!upchar <nama>` - Push info karakter secara manual.
  - `!upanim <nama>` - Push info anime secara manual.
  - `!nondivorce` - Menonaktifkan fitur cerai (Global).
  - `!activedivorce` - Mengaktifkan kembali fitur cerai.

---

## ☎️ 12. KONTAK & SUPPORT
Jika mengalami kendala atau ingin memberikan saran/kerjasama, hubungi owner:
- **Owner Name**: Mimin Artemis🍪 (Haruxa)
- **WhatsApp**: `+62 815-5017-7145`
- **Community**: ArtemisOtaku.ID 🎌
- **Website**: [MyAnimeList Profile](https://myanimelist.net/) (Support Jikan API)

---
*Bot ini menggunakan prefix: `!`*
*Ketik `!menu` untuk melihat panduan cepat.*
*ArtemisOtaku.ID Development Team.*
