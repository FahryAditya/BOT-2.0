const config = require('./config');
const quizManager = require('./quizManager');

// Anti-duplication: Track processed message IDs
const processedMessages = new Set();
setInterval(() => processedMessages.clear(), 30 * 60 * 1000); // Clear every 30 mins

// Import all command handlers
const basicCommands = require('./commands/basicCommands');
const animeCommands = require('./commands/animeCommands');
const absurdCommands = require('./commands/absurdCommands');
const waifuCommands = require('./commands/waifuCommands');
const genreCommands = require('./commands/genreCommands');
const gamesCommands = require('./commands/gamesCommands');
const aiCommands = require('./commands/aiCommands');
const newGames = require('./commands/newGames');
const specialCommands = require('./commands/specialFeatures');
const channelCommands = require('./commands/channelCommands');

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
  
  console.log(`[DEBUG] Parsing: "${trimmed}", Prefix: "${prefix}"`);
  
  if (!match) {
    console.log(`[DEBUG] No command match found.`);
    return null;
  }
  
  const commandName = match[1].toLowerCase();
  const params = match[2] ? match[2].trim() : '';
  
  console.log(`[DEBUG] Parsed: Command="${commandName}", Params="${params}"`);
  
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
    if (message.type !== 'chat') {
      if (!message.body) return;
    }

    const chatId = message.from;

    // 1. Parse command
    const parsed = parseCommand(message.body);
    
    if (!parsed) {
      // Cek apakah ada active quiz
      if (quizManager.hasActiveSession(chatId)) {
          console.log('🎮 Handling quiz answer...');
          return handleQuizAnswer(message, message.body.trim());
      }
      return;
    }
    
    const { command, params } = parsed;
    const args = params ? params.split(/\s+/) : [];
    
    console.log(`🚀 Executing: ${command} with params: "${params}"`);

    // 2. Route to handlers
    switch(command) {
      // BASIC COMMANDS
      case 'ping':
        await basicCommands.ping(message);
        break;
      
      case 'menu':
        await basicCommands.menu(message);
        break;
      
      case 'tagall':
        await basicCommands.tagAll(message);
        break;
      
      // ANIME COMMANDS
      case 'manga':
        await animeCommands.manga(message, args);
        break;
      
      case 'animechar':
        await animeCommands.animeChar(message, args);
        break;
      
      case 'seasonnow':
        await animeCommands.seasonNow(message);
        break;
      
      case 'topanime':
        await animeCommands.topAnime(message);
        break;
      
      case 'topmanga':
        await animeCommands.topManga(message);
        break;
      
      // GENRE COMMANDS
      case 'animegenre':
        await genreCommands.animeGenre(message);
        break;
      
      case 'searchgenre':
        await genreCommands.searchGenre(message, args);
        break;
      
      case 'randomgenre':
        await genreCommands.randomGenre(message);
        break;
      
      // ABSURD COMMANDS
      case 'animememe':
        await absurdCommands.animeMeme(message);
        break;
      case 'animefact':
        await absurdCommands.animeFact(message);
        break;
      case 'animeweirdchar':
        await absurdCommands.animeWeirdChar(message);
        break;
      case 'guessanime':
        await absurdCommands.guessAnime(message);
        break;
      case 'animeemoji':
        await absurdCommands.animeEmoji(message);
        break;
      case 'animevs':
        await absurdCommands.animeVs(message);
        break;
      case 'animeghost':
        await absurdCommands.animeGhost(message);
        break;
      case 'animerandomquote':
        await absurdCommands.animeRandomQuote(message);
        break;
      case 'animefood':
        await absurdCommands.animeFood(message);
        break;
      case 'animepet':
        await absurdCommands.animePet(message);
        break;
      case 'skipquiz':
        await absurdCommands.skipQuiz(message);
        break;

      // ======= 18 GAMES =======
      case 'guesstheanime':
      case 'guessthecharacter':
      case 'mangaquiz':
      case 'openingquiz':
      case 'animerate':
      case 'spainwaifu': // SPIN WAIFU
      case 'spinwaifu':
      case 'animetrivia':
      case 'waifutournament':
      case 'dailymission':
      case 'destiny':
      case 'shiritori':
      case 'emojiriddles':
      case 'scramble':
      case 'guessscene':
      case 'hangman':
      case 'waifucompat':
        // Check if function exists in gamesCommands
        if (typeof gamesCommands[command] === 'function') {
            await gamesCommands[command](message, params);
        } else if (typeof newGames[command] === 'function') {
            await newGames[command](message, args);
        } else {
            // Fallback to handleGameCommand if it exists (legacy)
            if (typeof gamesCommands.handleGameCommand === 'function') {
                await gamesCommands.handleGameCommand(message, command, args);
            } else {
                message.reply(`❌ Game !${command} belum tersedia.`);
            }
        }
        break;
      
      case 'roleplay':
        // Some games might be in specialCommands
        if (typeof gamesCommands.roleplay === 'function') {
            await gamesCommands.roleplay(message, params);
        } else {
            await specialCommands.moderation(message, args); // Legacy mapping
        }
        break;

      // WAIFU COMMANDS
      case 'cariwaifu':
        await waifuCommands.cariWaifu(message, params);
        break;
      
      case 'randomwaifu':
        await waifuCommands.randomWaifu(message);
        break;
      
      case 'waifuquiz':
        await waifuCommands.waifuQuiz(message);
        break;
      
      case 'otakudesu':
        await waifuCommands.otakudesu(message);
        break;

      // SPECIAL COMMANDS
      case 'profile':
        await specialCommands.profile(message, args);
        break;
      
      case 'adventure':
        await specialCommands.rpg(message);
        break;
      
      case 'setprofile':
        await specialCommands.profile(message, args);
        break;
      
      case 'tracker':
        await specialCommands.tracker(message, args);
        break;
      
      case 'moderation':
        await specialCommands.moderation(message, args);
        break;

      // ADDITIONAL
      case 'ai':
        await aiCommands.aiChat(message, params);
        break;
      
      // CHANNEL COMMANDS (SECRET)
      case 'upchar':
        await channelCommands.updateCharacterChannel(message, params);
        break;

      case 'upanim':
        await channelCommands.updateAnimeChannel(message, params);
        break;

      default:
        // Optional: Reply for unknown command
        // if (parsed) message.reply('❌ Command tidak ditemukan!');
        break;
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
        const result = quizManager.checkAnswer(chatId, answer);
        
        if (!result) return;
        
        if (result.correct) {
            const emoji = result.attempts === 1 ? '🏆' : result.attempts === 2 ? '🎉' : '✅';
            
            await msg.reply(
                `${emoji} *BENAR!*\n\n` +
                `Jawaban: *${result.answer}*\n` +
                `Percobaan: ${result.attempts}x\n\n` +
                (result.partial ? '_(Jawaban kamu hampir benar!)_\n\n' : '') +
                `Main lagi? Ketik !guessanime atau !waifuquiz!`
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
