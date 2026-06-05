const config = require('./config');
const quizManager = require('./quizManager');

// Import semua command handlers
const { handlePing, handleMenu } = require('./commands/basicCommands');
const { 
    handleManga, 
    handleAnimeChar, 
    handleSeasonNow, 
    handleTopAnime, 
    handleTopManga 
} = require('./commands/animeCommands');
const {
    handleAnimeMeme,
    handleAnimeFact,
    handleAnimeWeirdChar,
    handleGuessAnime,
    handleAnimeEmoji,
    handleAnimeVs,
    handleAnimeGhost,
    handleAnimeRandomQuote,
    handleAnimeFood,
    handleAnimePet,
    handleSkipQuiz
} = require('./commands/absurdCommands');
const {
    handleCariWaifu,
    handleRandomWaifu,
    handleWaifuQuiz,
    handleOtakudesu
} = require('./commands/waifuCommands');
const {
    handleAnimeGenre,
    handleSearchGenre,
    handleRandomGenre
} = require('./commands/genreCommands');

async function handleMessage(msg) {
    try {
        // Hanya proses pesan teks
        if (msg.type !== 'chat') {
            // Jika ada caption di gambar/video, bisa diproses sebagai teks
            if (!msg.body) return;
        }

        const body = msg.body.trim();
        const chatId = msg.from;
        
        // Ignore jika bukan command
        if (!body.startsWith(config.prefix)) {
            // Cek apakah ada active quiz
            if (quizManager.hasActiveSession(chatId)) {
                console.log('🎮 Handling quiz answer...');
                return handleQuizAnswer(msg, body);
            }
            return;
        }
        
        // Parse command dan arguments
        const args = body.slice(config.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        
        console.log(`🚀 Executing command: "${command}" from ${chatId}`);
        
        // Route ke handler yang sesuai
        switch(command) {
            // Basic Commands
            case 'ping':
                console.log('⚡ Executing: ping');
                await handlePing(msg);
                break;
            
            case 'menu':
                console.log('📋 Executing: menu');
                await handleMenu(msg);
                break;
            
            // Anime Commands
            case 'manga':
                console.log('📖 Executing: manga');
                await handleManga(msg, args);
                break;
            
            case 'animechar':
                console.log('👤 Executing: animechar');
                await handleAnimeChar(msg, args);
                break;
            
            case 'seasonnow':
                console.log('🎌 Executing: seasonnow');
                await handleSeasonNow(msg);
                break;
            
            case 'topanime':
                console.log('🏆 Executing: topanime');
                await handleTopAnime(msg);
                break;
            
            case 'topmanga':
                console.log('📚 Executing: topmanga');
                await handleTopManga(msg);
                break;
            
            // Genre Commands
            case 'animegenre':
                console.log('🎭 Executing: animegenre');
                await handleAnimeGenre(msg);
                break;
            
            case 'searchgenre':
                console.log('🔍 Executing: searchgenre');
                await handleSearchGenre(msg, args);
                break;
            
            case 'randomgenre':
                console.log('🎲 Executing: randomgenre');
                await handleRandomGenre(msg);
                break;
            
            // Absurd Commands
            case 'animememe':
                console.log('😂 Executing: animememe');
                await handleAnimeMeme(msg);
                break;
            
            case 'animefact':
                console.log('🤔 Executing: animefact');
                await handleAnimeFact(msg);
                break;
            
            case 'animeweirdchar':
                console.log('🎭 Executing: animeweirdchar');
                await handleAnimeWeirdChar(msg);
                break;
            
            case 'guessanime':
                console.log('🎮 Executing: guessanime');
                await handleGuessAnime(msg);
                break;
            
            case 'animeemoji':
                console.log('😊 Executing: animeemoji');
                await handleAnimeEmoji(msg);
                break;
            
            case 'animevs':
                console.log('⚔️ Executing: animevs');
                await handleAnimeVs(msg);
                break;
            
            case 'animeghost':
                console.log('👻 Executing: animeghost');
                await handleAnimeGhost(msg);
                break;
            
            case 'animerandomquote':
                console.log('💬 Executing: animerandomquote');
                await handleAnimeRandomQuote(msg);
                break;
            
            case 'animefood':
                console.log('🍜 Executing: animefood');
                await handleAnimeFood(msg);
                break;
            
            case 'animepet':
                console.log('🐾 Executing: animepet');
                await handleAnimePet(msg);
                break;
            
            case 'skipquiz':
                console.log('⏭️ Executing: skipquiz');
                await handleSkipQuiz(msg);
                break;
            
            // Waifu Commands
            case 'cariwaifu':
                console.log('💕 Executing: cariwaifu');
                await handleCariWaifu(msg, args);
                break;
            
            case 'randomwaifu':
                console.log('💕 Executing: randomwaifu');
                await handleRandomWaifu(msg);
                break;
            
            case 'waifuquiz':
                console.log('🎮 Executing: waifuquiz');
                await handleWaifuQuiz(msg);
                break;
            
            case 'otakudesu':
                console.log('🎌 Executing: otakudesu');
                await handleOtakudesu(msg);
                break;
            
            default:
                console.log('❓ Unknown command:', command);
                await msg.reply(
                    `❌ Command tidak ditemukan!\n\n` +
                    `Ketik *${config.prefix}menu* untuk melihat daftar command.`
                );
        }
        
        console.log('✅ Command executed successfully');
        
    } catch (error) {
        console.error('❌ Error in handleMessage:', error);
        console.error('Stack trace:', error.stack);
        
        try {
            await msg.reply('❌ Terjadi error saat memproses command!');
        } catch (replyError) {
            console.error('❌ Error sending error reply:', replyError);
        }
    }
}

// Handler untuk jawaban quiz
async function handleQuizAnswer(msg, answer) {
    try {
        const chatId = msg.from;
        const result = quizManager.checkAnswer(chatId, answer);
        
        if (!result) {
            console.log('⚠️ No quiz result');
            return;
        }
        
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

module.exports = { handleMessage };