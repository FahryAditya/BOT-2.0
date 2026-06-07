# 📋 Instruksi Pengembangan Bot WhatsApp Anime untuk Gemini

**Status**: Development Features Enhancement  
**Target Bot**: Anime WhatsApp Bot 2.0  
**Date**: 2026

---

## 🎯 OBJECTIVE UTAMA

Kamu adalah AI assistant yang membantu develop fitur-fitur bot WhatsApp dengan tema anime. Tugasmu adalah:
1. Generate code untuk fitur-fitur yang diminta
2. Jelaskan implementasi dengan detail
3. Provide debugging tips & best practices
4. Suggest improvements & optimizations

---

## 📌 FITUR YANG PERLU DIKEMBANGKAN

### 1️⃣ WELCOME MESSAGE SYSTEM
**Trigger**: Member baru join grup  
**Flow**:
```
Member join → Bot scan nama user → Kirim welcome message → Tag member
```

**Output Format**:
```
Selamat datang { nama user }

🌑✨- 𝙒𝙀𝙇𝘾𝙊𝙈𝙀 𝙄𝙉 -✨🌑
🌑✨ 𝘼𝙧𝙩𝙚𝙢𝙞𝙨𝙊𝙩𝙖𝙠𝙪. 𝙄𝘿✨🌑
Yuk kenalan dulu biar makin akrab 🖤
Komunitas anime, manga, & game
    🌑 𝗜𝗡𝗧𝗥𝗢 𝗗𝗨𝗟𝗨 𝗬𝗔 🌑
─────── ⋆⋅☆⋅⋆ ───────
    「 𝒄𝒂𝒓𝒅 𝒊𝒏𝒕𝒓𝒐 」
▃▃▃▃▃▃▃▃▃▃▃▃
│ ✧ ✌ salam kenal ✌ ✧
│┈➤✎ᝰ Nama :
│┈➤✎ᝰ Usia :
│┈➤✎ᝰ Asal Kota :
│┈➤✎ᝰ Hobi :
│┈➤✎ᝰ Waifu / Husbando :
╰┈┈ஜ⁀➴°
📝 Info pribadi tidak wajib diisi
───────────────
📌 PERHATIAN
• Gunakan bahasa yang sopan
• Tidak menggunakan gw / lu
• Dilarang berkata kasar
• Hormati sesama member
```

**Requirements**:
- Extract nama user dari event member baru
- Tag member di welcome message
- Format dengan ASCII art yang menarik
- Store intro data dari member (optional)

---

### 2️⃣ MEMBER TAGGING SYSTEM
**Capability**: Bot bisa mention/tag member secara individual dan group  
**Use Cases**:
- Tagging di welcome message
- Tagging di announce important message
- Tagging member dalam games/quiz

**Implementation Details**:
- Use WhatsApp mention format: `@nomor`
- Build list of all group members
- Create function: `tagMember(phoneNumber, name)`
- Create function: `tagAllMembers()` untuk group tagging

---

### 3️⃣ WHATSAPP CHANNEL MANAGEMENT
**Capability**: Bot bisa kelola WhatsApp Status/Channel  
**Features**:
- Update channel dengan content anime
- Schedule posting (08:00, 14:00, 19:00 WIB)
- Content types: Character info, Anime updates, Manga reviews

**Content Template**:
```
━━━━━━━━━━━━━━━━━━━
🎌 DAILY ANIME UPDATE
━━━━━━━━━━━━━━━━━━━

📺 Anime: [Nama]
✨ Genre: [Genre]
📊 Rating: [Rating]
💫 Sinopsis: [Deskripsi singkat]

🌟 Karakter Favorit:
• [Char 1] - [Brief description]
• [Char 2] - [Brief description]

━━━━━━━━━━━━━━━━━━━
Sent by: ArtemisOtaku.ID Bot
```

**Schedule**:
- 08:00 WIB - Character Spotlight
- 14:00 WIB - Anime Update
- 19:00 WIB - Manga Review

**Implementation Needs**:
- Integrate dengan scheduling library (node-cron)
- Create content database/API integration
- Queue system untuk multi-channel posting

---

### 4️⃣ 12 ANIME GAME FEATURES

#### Game 1: 🎬 GUESS THE ANIME
```
Bot: Tebak anime dari deskripsi ini!
Deskripsi: "Cerita tentang pemuda yang punya kekuatan supernatural..."
Pilihan: A) Jujutsu Kaisen B) Bleach C) My Hero Academia

Player punya 30 detik untuk jawab
Win: +100 Poin | Lose: 0 Poin
```

#### Game 2: 😱 GUESS THE CHARACTER
```
Bot: Siapa karakter ini?
Clue: "Mata Sharingan, Tinggal di Konoha..."
Answer: Sasuke Uchiha
```

#### Game 3: 🆚 ANIME VS BATTLE
```
Bot: Siapa yang menang dalam pertarungan?
Karakter A: Naruto (Power: 95/100)
Karakter B: Sasuke (Power: 93/100)
Vote A atau B → Hasil ada winner!
```

#### Game 4: 📖 MANGA CHAPTER QUIZ
```
Bot kirim quote dari manga
Player tebak manga mana quote itu berasal
A) One Piece B) Attack on Titan C) Chainsaw Man
```

#### Game 5: 🎵 ANIME OPENING LYRICS
```
Bot kirim 1 baris lirik opening anime
Player tebak anime mana
Pilihan multiple choice
```

#### Game 6: 🌟 RATE & REVIEW
```
Player: !animerate [judul] [rating 1-10] [review singkat]
Bot: Terima kasih review-mu! Total rating: 8.5/10
Leaderboard reviewer terbaik
```

#### Game 7: 🎰 SPIN THE WAIFU
```
Bot: *spin* 
Result: Karakter random + quote + image URL
Player bisa collect favorit
```

#### Game 8: 🧩 ANIME TRIVIA
```
Bot: Pertanyaan trivia anime (multiple choice)
Time limit: 20 detik
Win: +50 Poin, Streak counter
```

#### Game 9: 🏆 WAIFU TOURNAMENT
```
Grup vote siapa waifu terbaik setiap minggu
Bot tally votes
Announce winner dengan special message
```

#### Game 10: 🎯 DAILY MISSION
```
Bot: Hari ini misi-nya: Review 3 anime!
Player: !mission status / !mission claim
Reward: Points, badges, title
```

#### Game 11: 🔮 PICK YOUR DESTINY
```
Bot: Pilih jalan hidupmu di anime world:
A) Jadi ninja (+speed skill)
B) Jadi sorcerer (+ magic skill)
C) Jadi pirate (+ treasure skill)
→ Unlock special abilities & perks
```

#### Game 12: 🎭 ANIME CHARACTER ROLEPLAY
```
Bot: *Naruto mode activated!*
Bot reply sebagai Naruto dengan personality & catchphrase-nya
Player: berinteraksi dengan character bot
Score based on interaction quality
```

---

## 🛠️ TECHNICAL REQUIREMENTS

### Dependencies yang Diperlukan:
```json
{
  "whatsapp-web.js": "^1.0.0",
  "node-cron": "^3.0.0",
  "axios": "^1.4.0",
  "dotenv": "^16.0.0",
  "express": "^4.18.0"
}
```

### File Structure untuk Features Baru:
```
commands/
├── welcomeCommand.js          // Welcome & member greeting
├── channelCommand.js          // Channel management & scheduling
└── gamesCommands.js           // Semua 12 game features

utils/
├── memberManager.js           // Member tagging & list
├── channelScheduler.js        // Auto post channel
├── gameHelpers.js             // Game logic helpers
└── dataStore.js               // Game scores & leaderboard
```

---

## 📝 CODE GENERATION REQUIREMENTS

Saat generate code, pastikan:

### 1. Format & Style
```javascript
// ✅ DO:
const tagMember = (phoneNumber, name) => {
  return `@${phoneNumber.replace('@c.us', '')}`;
};

// ❌ DON'T:
function tagMember(phoneNumber,name){return `@${phoneNumber}`;};
```

### 2. Error Handling
```javascript
try {
  // Logic here
} catch (error) {
  console.error('Feature X error:', error);
  msg.reply('❌ Terjadi error. Silakan coba lagi.');
}
```

### 3. Documentation
```javascript
/**
 * Kirim welcome message ke member baru
 * @param {Object} chat - Chat object dari whatsapp-web.js
 * @param {string} memberName - Nama member baru
 * @param {string} memberPhone - Nomor member
 */
const sendWelcome = async (chat, memberName, memberPhone) => {
  // Implementation
};
```

### 4. Async/Await Usage
```javascript
// Always use async-await untuk file operations & API calls
const postToChannel = async (message) => {
  try {
    await client.sendMessage('channelId@broadcast', message);
  } catch (error) {
    console.error('Post failed:', error);
  }
};
```

---

## 🎨 MESSAGE FORMATTING RULES

### Style Guide:
- **Headers**: Gunakan emoji + text dengan separator (━━━━)
- **Lists**: Gunakan `│` dan `┈➤` untuk nested items
- **Emphasis**: Gunakan Unicode font (𝙀𝙈𝙊𝙉𝙄𝙒𝘦𝙞𝙤𝙛𝙖)
- **Color/Visual**: Gunakan emoji generously (🌑✨🎌💫)

### Contoh Format:
```
━━━━━━━━━━━━━━━━━
✨ GAME RESULTS ✨
━━━━━━━━━━━━━━━━━
👤 Nama: Habil
🏆 Points: +100
⭐ Streak: 5 Wins
─────────────────
Keep grinding! 💪
```

---

## 🔄 WORKFLOW IMPLEMENTATION

### Trigger: Member Join
1. WhatsApp event fires → `client.on('group_join')`
2. Extract member data (nama, nomor)
3. Send welcome message
4. Tag member dengan mention
5. Log ke database (optional)

### Trigger: Schedule Post (Cron Job)
1. Job runs di 08:00, 14:00, 19:00 WIB
2. Fetch content dari API/database
3. Format message sesuai template
4. Send ke channel
5. Log success/failure

### Trigger: Game Command
1. Player: `!game-name`
2. Bot validate player status
3. Execute game logic
4. Calculate score
5. Update leaderboard
6. Send result message

---

## 🧪 TESTING CHECKLIST

Saat code sudah selesai, test:
- [ ] Welcome message muncul saat member join
- [ ] Member name ter-extract dengan benar
- [ ] Tag mention working (ada @)
- [ ] Cron job berjalan di waktu yang benar
- [ ] Game logic valid (answer checking, scoring)
- [ ] Leaderboard update correctly
- [ ] All messages render dengan proper formatting
- [ ] No console errors or warnings
- [ ] Rate limiting handled (tidak spam)

---

## ⚠️ EDGE CASES TO HANDLE

1. **Member dengan nama spesial** (emoji, karakter unik)
   → Sanitize nama sebelum tag

2. **Member keluar sebelum intro selesai**
   → Validate member masih di grup

3. **API timeout saat fetch content**
   → Implement fallback message

4. **Multiple games berjalan bersamaan**
   → Use mutex/locking mechanism

5. **Database storage penuh**
   → Implement data cleanup/archival

---

## 💡 OPTIMIZATION TIPS

1. **Caching**: Cache API responses untuk avoid rate limit
2. **Batching**: Send multiple messages dalam 1 batch
3. **Queue**: Implement message queue untuk scheduled posts
4. **Compression**: Compress image URL responses
5. **Lazy Loading**: Load game data on-demand

---

## 📚 REFERENCE DOCUMENTATION

- **whatsapp-web.js**: https://docs.wwebjs.dev/
- **node-cron**: https://github.com/kelektiv/node-cron
- **Unicode Text Generator**: https://lingojam.com/

---

## 🚀 DEPLOYMENT NOTES

Saat deploy ke production:
1. Gunakan environment variables untuk sensitive data
2. Enable logging untuk monitoring
3. Set up error alerts
4. Regular backup data
5. Test di staging dulu

---

## 📞 NOTES

Jika Gemini butuh:
- Generate code lengkap → Provide context lengkap
- Debugging → Share error message + relevant code
- Explanation → Ask untuk detail specific
- Best practices → Mention use case & constraints

**Happy coding! 🗿☕**
