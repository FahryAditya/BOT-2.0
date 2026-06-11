const config = require('./config');
const quizManager = require('./quizManager');
const db = require('./utils/jsonDB');
const security = require('./utils/security');
const userStats = require('./utils/userStats');

// Anti-duplication: Track processed message IDs
const processedMessages = new Set();
setInterval(() => {
  if (processedMessages.size > 500) {
    processedMessages.clear();
  }
}, 5 * 60 * 1000); // Check every 5 mins, clear if too many

// Import all command handlers once
const basicCommands = require('./commands/basicCommands');
const animeCommands = require('./commands/animeCommands');
const absurdCommands = require('./commands/absurdCommands');
const waifuCommands = require('./commands/waifuCommands');
const genreCommands = require('./commands/genreCommands');
const gamesCommands = require('./commands/gamesCommands');
const aiCommands = require('./commands/aiCommands');
const newGames = require('./commands/newGames');
const specialCommands = require('./commands/specialFeatures');
const specialCommands2 = require('./commands/specialFeatures2');
const channelCommands = require('./commands/channelCommands');
const newFeatures = require('./utils/newFeatures');
const mediaCommands = require('./commands/mediaCommands');

// Combine all handlers once at module level
const commandHandlers = {
    ...basicCommands,
    ...animeCommands,
    ...absurdCommands,
    ...waifuCommands,
    ...genreCommands,
    ...gamesCommands,
    ...aiCommands,
    ...newGames,
    ...specialCommands,
    ...specialCommands2,
    ...channelCommands,
    ...mediaCommands
};

// Aliases & Custom Mappings
const aliases = {
    // Media & Basic
    'stiker': 'makeSticker',
    'sticker': 'makeSticker',
    'gif': 'makeGif',
    'tagall': 'tagAll',
    
    // Anime Info
    'animechar': 'animeChar',
    'manga': 'manga',
    'seasonnow': 'seasonNow',
    'topanime': 'topAnime',
    'topmanga': 'topManga',
    
    // Genre
    'searchgenre': 'searchGenre',
    'randomgenre': 'randomGenre',
    'animegenre': 'animeGenre',
    
    // Games & Quiz
    'tebakanime': 'guessAnime',
    'guesstheanime': 'guessAnime',
    'guessthecharacter': 'guessthecharacter',
    'mangaquiz': 'mangaquiz',
    'openingquiz': 'openingquiz',
    'spainwaifu': 'spinwaifu',
    'spinwaifu': 'spinwaifu',
    'shiritori': 'shiritori',
    'slot': 'slot',
    'tebakangka': 'tebakangka',
    'tebakgambar': 'tebakgambar',
    'tebaktebakan': 'tebaktebakan',
    'hitung': 'hitung',
    'katabijak': 'katabijak',
    'skipquiz': 'skipQuiz',
    
    // Absurd Features
    'animefact': 'animeFact',
    'animememe': 'animeMeme',
    'animecharabsurd': 'animeWeirdChar',
    'animeemoji': 'animeEmoji',
    'animevs': 'animeVs',
    'animeghost': 'animeGhost',
    'animemood': 'animeRandomQuote',
    'animefood': 'animeFood',
    'animepet': 'animePet',
    
    // Waifu & Economy
    'cariwaifu': 'cariWaifu',
    'randomwaifu': 'randomWaifu',
    'waifuquiz': 'waifuQuiz',
    'otakudesu': 'otakudesu',
    'waifusafari': 'waifuSafari',
    'rank': 'rank',
    'inventory': 'inventory',
    'daily': 'daily',
    'work': 'work',
    'bank': 'bank',
    'shop': 'shop',
    
    // Social & RPG
    'marry': 'marry',
    'divorce': 'divorce',
    'marrylist': 'marrylist',
    'steal': 'steal',
    'duel': 'duel',
    'give': 'give',
    'git': 'git',
    'leaderboardglobal': 'leaderboardglobal',
    'heal': 'heal',
    'upgrade': 'upgrade',
    'wish': 'wish',
    'setbio': 'setbio',
    'setprofile': 'profile',
    'adventure': 'rpg',
    
    // Admin & Utility
    'upanim': 'updateAnimeChannel',
    'detectanime': 'detectAnime',
    'animenews': 'animeNews',
    'tracker': 'tracker',
    'neofact': 'neoFact',
    'giftpoint': 'giftPointAll'
};

/**
 * Robust parsing for commands
 * @param {string} messageBody 
 * @returns {Object|null}
 */
const parseCommand = (messageBody) => {
  if (!messageBody) return null;
  const trimmed = messageBody.trim();
  
  // Extract command (starts with prefix)
  const prefix = config.prefix || '!';
  const regex = new RegExp(`^${prefix}(\\w+)(?:\\s+(.*))?$`, 'i');
  const match = trimmed.match(regex);
  
  if (!match) return null;
  
  const commandName = match[1].toLowerCase();
  const params = match[2] ? match[2].trim() : '';
  
  return {
    command: commandName,
    params: params,
    fullBody: trimmed
  };
};

/**
 * Main message handler
 * @param {Object} message 
 */
const handleMessage = async (message) => {
  try {
    // 0. Deduplication check
    const msgId = message.id._serialized;
    if (processedMessages.has(msgId)) return;
    processedMessages.add(msgId);

    // Hanya proses pesan teks
    if (message.type !== 'chat' && !message.body) {
      return;
    }

    const chatId = message.from;
    const user = message.author || message.from;

    // 1. Parse command
    const parsed = parseCommand(message.body);
    
    if (!parsed) {
      // Cek apakah ada active quiz
      if (quizManager.hasActiveSession(chatId)) {
          return handleQuizAnswer(message, message.body.trim());
      }
      return;
    }

    const { command, params } = parsed;
    const args = params ? params.split(/\s+/) : [];

    // 2. Route to handlers
    const actualCommand = aliases[command] || command;

    if (typeof commandHandlers[actualCommand] === 'function') {
        const isGroup = chatId.endsWith('@g.us');
        console.log(`🚀 [${new Date().toLocaleTimeString()}] ${isGroup ? 'GROUP' : 'CHAT'} ${chatId} calling: ${actualCommand}`);

        // --- USER LIMIT CHECK (Optimized for Speed) ---
        // Use the actual function names here
        const fastCommands = ['handlePing', 'ping', 'nondivorce', 'activedivorce', 'updateCharacterChannel', 'updateAnimeChannel', 'neoFact', 'giftPointAll'];
        if (!fastCommands.includes(actualCommand)) {
            // Run typing indicator in background (non-blocking)
            message.getChat().then(chat => chat.sendStateTyping()).catch(() => {});
        }
        
        try {
            await commandHandlers[actualCommand](message, args, params);
        } catch (error) {
            if (error.message.includes('Execution context was destroyed')) {
                console.warn(`⚠️ [RETRY] Context destroyed for !${actualCommand}, user might have triggered navigation.`);
                // Optional: silent retry once if appropriate, or just ignore to prevent crash
                return; 
            }
            console.error(`❌ Error executing command !${actualCommand}:`, error);
            await message.reply('❌ Terjadi kesalahan saat menjalankan command.');
        }
    } else if (newFeatures[actualCommand]) {
        try {
            await newFeatures[actualCommand](message, args);
        } catch (error) {
            console.error(`❌ Error in newFeatures !${actualCommand}:`, error);
        }
    }

  } catch (error) {
    console.error(`❌ Error in handleMessage (${message.body}):`, error);
    try {
      await message.reply('❌ Terjadi error saat memproses command!');
    } catch (err) {
      console.error('❌ Could not send error reply:', err);
    }
  }
};

/**
 * Handler for quiz answers
 * @param {Object} msg 
 * @param {string} answer 
 */
async function handleQuizAnswer(msg, answer) {
    try {
        const chatId = msg.from;
        const user = msg.author || msg.from;
        const result = quizManager.checkAnswer(chatId, answer);
        
        if (!result) return;
        
        if (result.correct) {
            const emoji = result.attempts === 1 ? '🏆' : result.attempts === 2 ? '🎉' : '✅';
            const pointsReward = result.attempts === 1 ? 100 : result.attempts === 2 ? 50 : 20;
            
            const stats = await userStats.addPoints(user, pointsReward);
            
            await msg.reply(
                `${emoji} *BENAR!*\n\n` +
                `Jawaban: *${result.answer}*\n` +
                `Percobaan: ${result.attempts}x\n` +
                `Hadiah: +${pointsReward} points 💰\n\n` +
                `Level: ${stats.level} (${stats.exp} EXP)\n` +
                (result.partial ? '_(Jawaban kamu hampir benar!)_\n\n' : '') +
                `Main lagi? Ketik !tebakangka atau !tebakgambar!`
            );
        } else {
            let response = `❌ *SALAH!*\n\nPercobaan ke-${result.attempts}\n\n`;
            
            if (result.hint) {
                response += `💡 *Hint tambahan:* ${result.hint}\n\n`;
            }
            
            response += `Coba lagi atau ketik !skipquiz untuk menyerah!`;
            
            await msg.reply(response);
        }
    } catch (error) {
        console.error('❌ Error in handleQuizAnswer:', error);
    }
}

module.exports = { handleMessage, parseCommand };
