# 📱 WhatsApp Channel Management System untuk Anime Bot

**Status**: Channel Auto-Update Feature  
**Channel**: ArtemisOtaku.ID  
**Date**: 7 Juni 2026

---

## 🎯 OBJECTIVE

Bot bisa:
1. ✅ Kirim update anime ke saluran WhatsApp secara otomatis (scheduled)
2. ✅ Admin commands RAHASIA buat bahas karakter anime (manual trigger)
3. ✅ Admin commands RAHASIA buat bahas anime lengkap (manual trigger)
4. ✅ Semua data pakai Jikan API

---

## 📋 SISTEM OVERVIEW

```
Admin (You)
    ↓
!artemi-char-[SECRET] <nama karakter> ← Rahasia! Hanya admin
    ↓
Bot fetch data dari Jikan API
    ↓
Format + beautify message
    ↓
Kirim ke Channel WhatsApp (ArtemisOtaku.ID)

---

Admin (You)
    ↓
!artemi-anime-[SECRET] <nama anime> ← Rahasia! Hanya admin
    ↓
Bot fetch data dari Jikan API
    ↓
Format + beautify message
    ↓
Kirim ke Channel WhatsApp (ArtemisOtaku.ID)

---

Scheduler (Cron Job)
    ↓
08:00 WIB → Random Character Update
14:00 WIB → Random Anime Update
19:00 WIB → Top Anime/Manga Update
    ↓
Kirim ke Channel WhatsApp (ArtemisOtaku.ID)
```

---

## 🔐 SETUP SECRET ADMIN COMMANDS

### Step 1: Create Secret Key

**File**: `.env`
```
# CHANNEL MANAGEMENT
CHANNEL_ID=120363...@g.us  # ID saluran WhatsApp kamu (tanya Claude untuk cara dapat)
ADMIN_SECRET_CHAR=artemis_char_rahasia_2026
ADMIN_SECRET_ANIME=artemis_anime_rahasia_2026
ADMIN_USER_ID=62812...@c.us  # Nomor WhatsApp kamu (admin only)
```

### Step 2: Protect Admin Commands

**File**: `helpers.js` (tambah function baru)

```javascript
/**
 * Verify apakah user adalah admin
 */
const isAdmin = (message) => {
  const adminId = process.env.ADMIN_USER_ID;
  const senderId = message.author || message.from;
  
  return senderId === adminId;
};

/**
 * Verify secret command code
 */
const verifySecretCode = (providedCode, secretType) => {
  if (secretType === 'char') {
    return providedCode === process.env.ADMIN_SECRET_CHAR;
  }
  if (secretType === 'anime') {
    return providedCode === process.env.ADMIN_SECRET_ANIME;
  }
  return false;
};

module.exports = { isAdmin, verifySecretCode };
```

---

## 📝 IMPLEMENTATION

### FILE 1: Create `commands/channelCommands.js`

```javascript
const axios = require('axios');
const { isAdmin, verifySecretCode } = require('../helpers');

/**
 * ADMIN COMMAND - Update Karakter ke Channel
 * Usage: !artemi-char-[SECRET] naruto
 * 
 * EXAMPLE (RAHASIA):
 * !artemi-char-artemis_char_rahasia_2026 naruto
 * 
 * Hanya admin yang tau command-nya!
 */
const updateCharacterChannel = async (message, params) => {
  try {
    // 1. Verify admin
    if (!isAdmin(message)) {
      console.log('Unauthorized attempt:', message.from);
      return; // Jangan kasih response apa-apa (rahasia!)
    }
    
    // 2. Parse parameters: "[SECRET] [nama karakter]"
    const parts = params.split(' ');
    const secretCode = parts[0];
    const characterName = parts.slice(1).join(' ').trim();
    
    // 3. Verify secret code
    if (!verifySecretCode(secretCode, 'char')) {
      message.reply('❌ Secret code salah!');
      return;
    }
    
    // 4. Validate input
    if (!characterName) {
      message.reply('❌ Format: !artemi-char-[SECRET] <nama karakter>');
      return;
    }
    
    // Show loading
    await message.reply(`🔄 Fetch data karakter "${characterName}"...`);
    
    // 5. Fetch dari Jikan API
    const charResponse = await axios.get('https://api.jikan.moe/v4/characters', {
      params: {
        query: characterName,
        limit: 1
      }
    });
    
    if (!charResponse.data.data || charResponse.data.data.length === 0) {
      return message.reply(`❌ Karakter "${characterName}" tidak ditemukan!`);
    }
    
    const character = charResponse.data.data[0];
    
    // 6. Format message untuk channel
    const channelMessage = formatCharacterChannel(character);
    
    // 7. Kirim ke channel
    await sendToChannel(channelMessage);
    
    // 8. Confirm ke admin
    message.reply('✅ Update karakter berhasil dikirim ke channel!');
    
  } catch (error) {
    console.error('updateCharacterChannel error:', error);
    message.reply('❌ Error: ' + error.message);
  }
};

/**
 * ADMIN COMMAND - Update Anime ke Channel
 * Usage: !artemi-anime-[SECRET] naruto
 * 
 * EXAMPLE (RAHASIA):
 * !artemi-anime-artemis_anime_rahasia_2026 naruto
 * 
 * Hanya admin yang tau command-nya!
 */
const updateAnimeChannel = async (message, params) => {
  try {
    // 1. Verify admin
    if (!isAdmin(message)) {
      console.log('Unauthorized attempt:', message.from);
      return; // Jangan kasih response apa-apa (rahasia!)
    }
    
    // 2. Parse parameters
    const parts = params.split(' ');
    const secretCode = parts[0];
    const animeName = parts.slice(1).join(' ').trim();
    
    // 3. Verify secret code
    if (!verifySecretCode(secretCode, 'anime')) {
      message.reply('❌ Secret code salah!');
      return;
    }
    
    // 4. Validate input
    if (!animeName) {
      message.reply('❌ Format: !artemi-anime-[SECRET] <nama anime>');
      return;
    }
    
    // Show loading
    await message.reply(`🔄 Fetch data anime "${animeName}"...`);
    
    // 5. Fetch dari Jikan API
    const animeResponse = await axios.get('https://api.jikan.moe/v4/anime', {
      params: {
        query: animeName,
        limit: 1
      }
    });
    
    if (!animeResponse.data.data || animeResponse.data.data.length === 0) {
      return message.reply(`❌ Anime "${animeName}" tidak ditemukan!`);
    }
    
    const anime = animeResponse.data.data[0];
    
    // 6. Format message untuk channel
    const channelMessage = formatAnimeChannel(anime);
    
    // 7. Kirim ke channel
    await sendToChannel(channelMessage);
    
    // 8. Confirm ke admin
    message.reply('✅ Update anime berhasil dikirim ke channel!');
    
  } catch (error) {
    console.error('updateAnimeChannel error:', error);
    message.reply('❌ Error: ' + error.message);
  }
};

/**
 * Format character data untuk channel display
 */
const formatCharacterChannel = (character) => {
  const imageUrl = character.images?.jpg?.image_url || 'No image';
  const malId = character.mal_id;
  const animeList = character.anime && character.anime.length > 0
    ? character.anime.slice(0, 5).map(a => `• ${a.anime.title}`).join('\n')
    : 'N/A';
  
  return `
╔════════════════════════════════════╗
║  ✨ CHARACTER SPOTLIGHT ✨  ║
╚════════════════════════════════════╝

🎌 *${character.name.toUpperCase()}*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📸 Visual:
${imageUrl}

💬 Kanji: ${character.name_kanji || 'N/A'}

📺 Anime:
${animeList}

📖 Biography:
${character.about ? character.about.substring(0, 300) : 'Mysterious character...'}...

🔗 MyAnimeList:
https://myanimelist.net/character/${malId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 ArtemisOtaku.ID Channel Update
⏰ ${new Date().toLocaleString('id-ID')}
  `.trim();
};

/**
 * Format anime data untuk channel display
 */
const formatAnimeChannel = (anime) => {
  const imageUrl = anime.images?.jpg?.image_url || 'No image';
  const malId = anime.mal_id;
  const genres = anime.genres && anime.genres.length > 0
    ? anime.genres.map(g => g.name).join(', ')
    : 'N/A';
  
  const studios = anime.studios && anime.studios.length > 0
    ? anime.studios.map(s => s.name).join(', ')
    : 'N/A';
  
  const status = anime.status || 'N/A';
  const episodes = anime.episodes || '?';
  const score = anime.score ? `${anime.score}/10` : 'N/A';
  const aired = anime.aired?.string || 'N/A';
  
  return `
╔════════════════════════════════════╗
║  🎌 ANIME UPDATE 🎌  ║
╚════════════════════════════════════╝

📺 *${anime.title.toUpperCase()}*
${anime.title_english ? `(${anime.title_english})` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🖼️ Poster:
${imageUrl}

📊 Information:
├ Score: ⭐ ${score}
├ Status: ${status}
├ Episodes: ${episodes}
├ Aired: ${aired}
├ Genres: ${genres}
└ Studios: ${studios}

📝 Synopsis:
${anime.synopsis ? anime.synopsis.substring(0, 250) : 'No synopsis'}...

🔗 MyAnimeList:
https://myanimelist.net/anime/${malId}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 ArtemisOtaku.ID Channel Update
⏰ ${new Date().toLocaleString('id-ID')}
  `.trim();
};

/**
 * Send message ke WhatsApp Channel
 */
const sendToChannel = async (message) => {
  try {
    const channelId = process.env.CHANNEL_ID;
    
    if (!channelId) {
      throw new Error('CHANNEL_ID tidak set di .env');
    }
    
    // Kirim ke channel
    const client = require('../index').client; // Adjust path sesuai struktur
    await client.sendMessage(channelId, message);
    
    console.log('✅ Message sent to channel');
  } catch (error) {
    console.error('sendToChannel error:', error);
    throw error;
  }
};

/**
 * Random character update (Scheduled - 08:00 WIB)
 */
const randomCharacterUpdate = async () => {
  try {
    console.log('🔄 Random character update triggered (08:00)');
    
    // Fetch random character
    const response = await axios.get('https://api.jikan.moe/v4/random/characters');
    const character = response.data.data;
    
    const message = formatCharacterChannel(character);
    await sendToChannel(message);
    
    console.log('✅ Random character update sent');
  } catch (error) {
    console.error('randomCharacterUpdate error:', error);
  }
};

/**
 * Random anime update (Scheduled - 14:00 WIB)
 */
const randomAnimeUpdate = async () => {
  try {
    console.log('🔄 Random anime update triggered (14:00)');
    
    // Fetch top anime
    const response = await axios.get('https://api.jikan.moe/v4/top/anime?limit=1');
    const anime = response.data.data[0];
    
    const message = formatAnimeChannel(anime);
    await sendToChannel(message);
    
    console.log('✅ Random anime update sent');
  } catch (error) {
    console.error('randomAnimeUpdate error:', error);
  }
};

/**
 * Top manga update (Scheduled - 19:00 WIB)
 */
const topMangaUpdate = async () => {
  try {
    console.log('🔄 Top manga update triggered (19:00)');
    
    // Fetch top manga
    const response = await axios.get('https://api.jikan.moe/v4/top/manga?limit=1');
    const manga = response.data.data[0];
    
    const message = formatAnimeChannel(manga); // Use same format
    await sendToChannel(message);
    
    console.log('✅ Top manga update sent');
  } catch (error) {
    console.error('topMangaUpdate error:', error);
  }
};

module.exports = {
  updateCharacterChannel,
  updateAnimeChannel,
  randomCharacterUpdate,
  randomAnimeUpdate,
  topMangaUpdate,
  sendToChannel,
  formatCharacterChannel,
  formatAnimeChannel
};
```

---

### FILE 2: Update `messageHandler.js`

```javascript
// Tambah di bagian imports
const channelCommands = require('./commands/channelCommands');

// Tambah di bagian command routing (dalam switch case)
case 'artemi-char-artemis_char_rahasia_2026': // SECRET COMMAND
  await channelCommands.updateCharacterChannel(message, params);
  break;

case 'artemi-anime-artemis_anime_rahasia_2026': // SECRET COMMAND
  await channelCommands.updateAnimeChannel(message, params);
  break;

// ATAU gunakan format yang lebih fleksibel:
// Handle secret commands
if (command.startsWith('artemi-char-')) {
  const secretCode = command.replace('artemi-char-', '');
  await channelCommands.updateCharacterChannel(message, secretCode + ' ' + params);
  break;
}

if (command.startsWith('artemi-anime-')) {
  const secretCode = command.replace('artemi-anime-', '');
  await channelCommands.updateAnimeChannel(message, secretCode + ' ' + params);
  break;
}
```

---

### FILE 3: Setup Scheduler `utils/channelScheduler.js`

```javascript
const cron = require('node-cron');
const channelCommands = require('../commands/channelCommands');

/**
 * Setup scheduled channel updates
 * 
 * 08:00 WIB - Random Character Update
 * 14:00 WIB - Random Anime Update
 * 19:00 WIB - Top Manga Update
 */
const setupChannelScheduler = () => {
  console.log('📅 Initializing channel scheduler...');
  
  // 08:00 WIB - Character Update
  // Cron format: minute hour day month weekday
  // 0 8 = 08:00
  cron.schedule('0 8 * * *', async () => {
    console.log('⏰ 08:00 WIB - Running character update...');
    try {
      await channelCommands.randomCharacterUpdate();
    } catch (error) {
      console.error('Scheduled character update error:', error);
    }
  }, {
    timezone: "Asia/Jakarta" // WIB timezone
  });
  
  // 14:00 WIB - Anime Update
  cron.schedule('0 14 * * *', async () => {
    console.log('⏰ 14:00 WIB - Running anime update...');
    try {
      await channelCommands.randomAnimeUpdate();
    } catch (error) {
      console.error('Scheduled anime update error:', error);
    }
  }, {
    timezone: "Asia/Jakarta"
  });
  
  // 19:00 WIB - Manga Update
  cron.schedule('0 19 * * *', async () => {
    console.log('⏰ 19:00 WIB - Running manga update...');
    try {
      await channelCommands.topMangaUpdate();
    } catch (error) {
      console.error('Scheduled manga update error:', error);
    }
  }, {
    timezone: "Asia/Jakarta"
  });
  
  console.log('✅ Channel scheduler initialized!');
};

module.exports = { setupChannelScheduler };
```

---

### FILE 4: Update `index.js` (Main Bot File)

```javascript
// ... existing code

const { setupChannelScheduler } = require('./utils/channelScheduler');

// Setelah client ready
client.on('ready', () => {
  console.log('✅ Bot is ready!');
  
  // Setup channel scheduler
  setupChannelScheduler();
});

// Export client untuk channel commands
module.exports = { client };
```

---

## 🔑 CARA MENDAPAT CHANNEL_ID

### Metode 1: Dari Web WhatsApp Inspect

1. Buka channel di web.whatsapp.com
2. Klik info channel (i)
3. Copy link atau ID dari URL

### Metode 2: Dari WhatsApp-Web.js Event

```javascript
client.on('message', async (message) => {
  if (message.body === '!getid') {
    console.log('Chat ID:', message.from);
    console.log('Chat type:', message.type);
    message.reply(`ID: ${message.from}`);
  }
});
```

Kirim `!getid` ke channel, lalu lihat console.

---

## 📋 .env CONFIGURATION

```env
# ============ CHANNEL MANAGEMENT ============
CHANNEL_ID=120363150...@g.us
ADMIN_USER_ID=62812...@c.us
ADMIN_SECRET_CHAR=artemis_char_rahasia_2026
ADMIN_SECRET_ANIME=artemis_anime_rahasia_2026

# ============ API ============
JIKAN_API=https://api.jikan.moe/v4

# ============ OTHER ============
NODE_ENV=production
```

---

## 🧪 TESTING

### Test 1: Admin Secret Command (Character)
```
User (Admin): !artemi-char-artemis_char_rahasia_2026 naruto
Bot Response: ✅ Update karakter berhasil dikirim ke channel!
Channel: [Character spotlight post]
```

### Test 2: Admin Secret Command (Anime)
```
User (Admin): !artemi-anime-artemis_anime_rahasia_2026 attack on titan
Bot Response: ✅ Update anime berhasil dikirim ke channel!
Channel: [Anime update post]
```

### Test 3: Scheduled Updates (Check Console)
```
⏰ 08:00 WIB - Running character update...
✅ Random character update sent

⏰ 14:00 WIB - Running anime update...
✅ Random anime update sent

⏰ 19:00 WIB - Running manga update...
✅ Top manga update sent
```

### Test 4: Non-Admin Tries Secret Command
```
User (Non-admin): !artemi-char-artemis_char_rahasia_2026 naruto
Bot Response: [Hening - jangan reply apa-apa]
Console: Unauthorized attempt: 62xxx@c.us
```

---

## 🔒 SECURITY CHECKLIST

- [ ] Secret codes disimpan di `.env`, jangan di-commit
- [ ] Admin verification berjalan sebelum action
- [ ] Non-admin tidak dapat trigger secret commands
- [ ] Channel ID aman dan hanya bisa di-edit admin
- [ ] Error messages jangan expose sensitive data

---

## 📝 CHANNEL MESSAGE EXAMPLES

### Character Update (08:00)
```
╔════════════════════════════════════╗
║  ✨ CHARACTER SPOTLIGHT ✨  ║
╚════════════════════════════════════╝

🎌 *NARUTO UZUMAKI*

📸 Visual: [image]
💬 Kanji: うずまきナルト
📺 Anime: • Naruto • Naruto Shippuden

📖 Biography: Naruto adalah protagonist dalam...

🔗 https://myanimelist.net/character/1234
```

### Anime Update (14:00)
```
╔════════════════════════════════════╗
║  🎌 ANIME UPDATE 🎌  ║
╚════════════════════════════════════╝

📺 *ATTACK ON TITAN*
(Shingeki no Kyojin)

📊 Information:
├ Score: ⭐ 8.9/10
├ Status: Finished
├ Episodes: 75
├ Aired: Apr 2013 - Nov 2023
├ Genres: Action, Dark Fantasy
└ Studios: WIT Studio, MAPPA
```

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] `node-cron` sudah di-install (`npm install node-cron`)
- [ ] `.env` sudah filled dengan CHANNEL_ID dan ADMIN_USER_ID
- [ ] Secret codes sudah di-set (jangan share!)
- [ ] `channelCommands.js` sudah di-create
- [ ] `channelScheduler.js` sudah di-create
- [ ] `messageHandler.js` sudah di-update dengan routing
- [ ] `index.js` sudah di-update dengan scheduler
- [ ] Test di group (non-admin) dan admin sebelum deploy

---

## 💡 NOTES

1. **Secret Command Format**: Jangan share command ke siapa pun!
   - `!artemi-char-artemis_char_rahasia_2026 [nama]`
   - `!artemi-anime-artemis_anime_rahasia_2026 [nama]`

2. **Timezone**: Scheduler pakai `Asia/Jakarta` (WIB)
   - Adjust jika lokasi berbeda

3. **API Rate Limit**: Jikan API punya rate limit ~60req/min
   - Jika sering error, tambah delay antar request

4. **Channel vs Group**: 
   - Channel = broadcast, tidak bisa reply
   - Group = bisa discuss, bisa reply
   - Adjust messaging strategy sesuai kebutuhan

---

## 🎯 FITUR FUTURE

- [ ] Customizable schedule time
- [ ] Multiple channel support
- [ ] Channel category/section selection
- [ ] Emoji customization per category
- [ ] Analytics (total posts, engagement)
- [ ] User voting untuk character/anime next update

---
