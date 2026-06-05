const apiService = require('../apiService');
const { downloadImage, formatAnimeInfo, formatMangaInfo, formatCharacterInfo } = require('../helpers');

async function handleManga(msg, args) {
    if (args.length === 0) {
        return msg.reply('❌ Gunakan: !manga <judul>\nContoh: !manga Naruto');
    }
    
    const query = args.join(' ');
    await msg.reply('🔍 Mencari manga...');
    
    const manga = await apiService.searchManga(query);
    
    if (!manga) {
        return msg.reply('❌ Manga tidak ditemukan!');
    }
    
    const info = formatMangaInfo(manga);
    
    // Download dan kirim gambar
    if (manga.images?.jpg?.large_image_url) {
        const media = await downloadImage(manga.images.jpg.large_image_url);
        if (media) {
            await msg.reply(media, null, { caption: info });
        } else {
            await msg.reply(info);
        }
    } else {
        await msg.reply(info);
    }
}

async function handleAnimeChar(msg, args) {
    if (args.length === 0) {
        return msg.reply('❌ Gunakan: !animechar <nama>\nContoh: !animechar Naruto');
    }
    
    const query = args.join(' ');
    await msg.reply('🔍 Mencari karakter...');
    
    const character = await apiService.searchCharacter(query);
    
    if (!character) {
        return msg.reply('❌ Karakter tidak ditemukan!');
    }
    
    const info = `👤 *${character.name}*\n` +
                 `📺 *Kanji:* ${character.name_kanji || 'N/A'}\n` +
                 `❤️ *Favorites:* ${character.favorites || 'N/A'}\n` +
                 `📝 *About:*\n${character.about?.substring(0, 500) || 'No information'}...`;
    
    // Download dan kirim gambar
    if (character.images?.jpg?.image_url) {
        const media = await downloadImage(character.images.jpg.image_url);
        if (media) {
            await msg.reply(media, null, { caption: info });
        } else {
            await msg.reply(info);
        }
    } else {
        await msg.reply(info);
    }
}

async function handleSeasonNow(msg) {
    await msg.reply('🔍 Mengambil anime musim ini...');
    
    const animes = await apiService.getSeasonNow();
    
    if (!animes || animes.length === 0) {
        return msg.reply('❌ Tidak dapat mengambil data anime musim ini!');
    }
    
    let response = '🎌 *ANIME MUSIM INI - TOP 5*\n\n';
    
    animes.forEach((anime, index) => {
        response += `${index + 1}. *${anime.title}*\n`;
        response += `   📊 Score: ${anime.score || 'N/A'}\n`;
        response += `   📺 Episodes: ${anime.episodes || '?'}\n`;
        response += `   🎭 ${anime.genres?.map(g => g.name).join(', ') || 'N/A'}\n\n`;
    });
    
    await msg.reply(response);
}

async function handleTopAnime(msg) {
    await msg.reply('🔍 Mengambil top anime...');
    
    const animes = await apiService.getTopAnime();
    
    if (!animes || animes.length === 0) {
        return msg.reply('❌ Tidak dapat mengambil data top anime!');
    }
    
    let response = '🏆 *TOP 5 ANIME TERBAIK*\n\n';
    
    animes.forEach((anime, index) => {
        response += `${index + 1}. *${anime.title}*\n`;
        response += `   📊 Score: ${anime.score || 'N/A'}\n`;
        response += `   📺 Episodes: ${anime.episodes || 'N/A'}\n`;
        response += `   🎭 ${anime.genres?.map(g => g.name).join(', ') || 'N/A'}\n\n`;
    });
    
    await msg.reply(response);
}

async function handleTopManga(msg) {
    await msg.reply('🔍 Mengambil top manga...');
    
    const mangas = await apiService.getTopManga();
    
    if (!mangas || mangas.length === 0) {
        return msg.reply('❌ Tidak dapat mengambil data top manga!');
    }
    
    let response = '🏆 *TOP 5 MANGA TERBAIK*\n\n';
    
    mangas.forEach((manga, index) => {
        response += `${index + 1}. *${manga.title}*\n`;
        response += `   📊 Score: ${manga.score || 'N/A'}\n`;
        response += `   📚 Chapters: ${manga.chapters || 'N/A'}\n`;
        response += `   🎭 ${manga.genres?.map(g => g.name).join(', ') || 'N/A'}\n\n`;
    });
    
    await msg.reply(response);
}

module.exports = {
    handleManga,
    handleAnimeChar,
    handleSeasonNow,
    handleTopAnime,
    handleTopManga
};