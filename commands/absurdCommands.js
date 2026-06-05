const apiService = require('../apiService');
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
    
    await msg.reply(
        `🎮 *TEBAK ANIME!*\n\n` +
        `${question.clue}\n\n` +
        `💡 *Hints:* ${question.hints.join(', ')}\n\n` +
        `Balas pesan ini dengan jawaban kamu!`
    );
    
    // Note: Untuk fitur validasi jawaban, perlu implementasi session management
    // yang lebih kompleks. Ini adalah versi sederhana.
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

module.exports = {
    handleAnimeMeme,
    handleAnimeFact,
    handleAnimeWeirdChar,
    handleGuessAnime,
    handleAnimeEmoji,
    handleAnimeVs,
    handleAnimeGhost,
    handleAnimeRandomQuote,
    handleAnimeFood,
    handleAnimePet
};