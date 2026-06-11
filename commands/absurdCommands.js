const apiService = require('../apiService');
const quizManager = require('../quizManager');
const { downloadImage, getRandomItem } = require('../helpers');
const { 
    absurdFacts, 
    weirdCharacters, 
    animeVsBattles, 
    animeGhostStories,
    animeFoods,
    animePets,
    animeEmojis,
    guessAnimeQuestions
} = require('../absurdData');

async function handleAnimeMeme(msg) {
    await msg.reply('😂 Mencari meme anime...');
    
    const meme = await apiService.getAnimeMeme();
    
    if (!meme || !meme.url) {
        return msg.reply('❌ Gagal mengambil meme!');
    }
    
    const media = await downloadImage(meme.url);
    
    if (media) {
        await msg.reply(media, null, { caption: `😂 *${meme.title || 'Anime Meme'}*` });
    } else {
        await msg.reply('❌ Gagal mendownload meme!');
    }
}

async function handleAnimeFact(msg) {
    const fact = getRandomItem(absurdFacts);
    await msg.reply(`🤔 *FAKTA ABSURD ANIME*\n\n${fact}`);
}

async function handleAnimeWeirdChar(msg) {
    const char = getRandomItem(weirdCharacters);
    await msg.reply(
        `🎭 *KARAKTER ABSURD*\n\n` +
        `👤 *Nama:* ${char.name}\n` +
        `📺 *Anime:* ${char.anime}\n\n` +
        `💬 *Quote Absurd:*\n"${char.quote}"`
    );
}

async function handleGuessAnime(msg) {
    const question = getRandomItem(guessAnimeQuestions);
    const qText = `🎮 *TEBAK ANIME!*\n\n${question.clue}\n\n💡 *Hints:* ${question.hints.join(', ')}\n\nBalas pesan ini dengan jawaban kamu!`;
    
    quizManager.createSession(msg.from, 'tebakanime', qText, question.answer, question.hints);
    await msg.reply(qText);
}

async function handleAnimeEmoji(msg) {
    const anime = getRandomItem(animeEmojis);
    await msg.reply(
        `${anime.emoji}\n\n` +
        `Tebak anime dari emoji di atas!\n` +
        `_Jawaban: ${anime.anime}_`
    );
}

async function handleAnimeVs(msg) {
    const battle = getRandomItem(animeVsBattles);
    await msg.reply(`⚔️ *PERTARUNGAN ABSURD*\n\n${battle}`);
}

async function handleAnimeGhost(msg) {
    const story = getRandomItem(animeGhostStories);
    await msg.reply(`👻 *CERITA HOROR ANIME*\n\n${story}`);
}

async function handleAnimeRandomQuote(msg) {
    const quote = await apiService.getRandomQuote();
    
    if (!quote) {
        // Fallback dengan quote dari weird characters
        const char = getRandomItem(weirdCharacters);
        return msg.reply(
            `💬 *QUOTE ABSURD*\n\n` +
            `"${char.quote}"\n\n` +
            `- ${char.name}`
        );
    }
    
    await msg.reply(
        `💬 *ANIME QUOTE*\n\n` +
        `"${quote.quote}"\n\n` +
        `- ${quote.character}\n` +
        `📺 ${quote.anime}`
    );
}

async function handleAnimeFood(msg) {
    const food = getRandomItem(animeFoods);
    await msg.reply(
        `🍜 *MAKANAN FAVORIT ABSURD*\n\n` +
        `👤 *Karakter:* ${food.character}\n` +
        `🍽️ *Makanan:* ${food.food}\n\n` +
        `Mau coba? 😋`
    );
}

async function handleAnimePet(msg) {
    const pet = getRandomItem(animePets);
    await msg.reply(
        `🐾 *KARAKTER JADI HEWAN*\n\n` +
        `👤 *Karakter:* ${pet.character}\n` +
        `🐱 *Jadi:* ${pet.pet}\n\n` +
        `Lucu ga sih? 😂`
    );
}

async function handleSkipQuiz(msg) {
    const chatId = msg.from;
    const session = quizManager.getSession(chatId);
    
    if (session) {
        quizManager.deleteSession(chatId);
        await msg.reply(`⏭️ Quiz dihentikan! Jawabannya adalah: *${session.answer}*`);
    } else {
        await msg.reply('❌ Tidak ada quiz yang sedang aktif.');
    }
}

async function handleNeoFact(msg) {
    // Generate random RAM usage between 1.0 and 31.9 GiB
    const usedRam = (Math.random() * (31.9 - 1.0) + 1.0).toFixed(1);
    
    const neofetch = `
\`\`\`
Anthropic@arch
------------
OS: Arch Linux
Kernel: Linux 7.0
Uptime: 2 days
Packages: 1200
Shell: bash
CPU: Intel Core i9 13900K
RAM: ${usedRam} GiB / 32 GiB
\`\`\`
    `.trim();
    
    await msg.reply(neofetch);
}

module.exports = {
    animeMeme: handleAnimeMeme,
    animeFact: handleAnimeFact,
    animeWeirdChar: handleAnimeWeirdChar,
    guessAnime: handleGuessAnime,
    animeEmoji: handleAnimeEmoji,
    animeVs: handleAnimeVs,
    animeGhost: handleAnimeGhost,
    animeRandomQuote: handleAnimeRandomQuote,
    animeFood: handleAnimeFood,
    animePet: handleAnimePet,
    skipQuiz: handleSkipQuiz,
    neoFact: handleNeoFact
};