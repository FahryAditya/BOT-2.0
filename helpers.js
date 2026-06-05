const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');

// Fungsi untuk download gambar dan convert ke MessageMedia
async function downloadImage(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const mimeType = response.headers['content-type'];
        return new MessageMedia(mimeType, base64);
    } catch (error) {
        console.error('Error downloading image:', error);
        return null;
    }
}

// Fungsi untuk format teks
function formatAnimeInfo(anime) {
    return `🎌 *${anime.title}*\n\n` +
           `📊 Score: ${anime.score || 'N/A'}\n` +
           `📺 Episodes: ${anime.episodes || 'N/A'}\n` +
           `📅 Status: ${anime.status || 'N/A'}\n` +
           `🎭 Genres: ${anime.genres?.map(g => g.name).join(', ') || 'N/A'}\n\n` +
           `📝 Synopsis:\n${anime.synopsis || 'No synopsis available'}`;
}

function formatMangaInfo(manga) {
    return `📖 *${manga.title}*\n\n` +
           `📊 Score: ${manga.score || 'N/A'}\n` +
           `📚 Chapters: ${manga.chapters || 'N/A'}\n` +
           `📅 Status: ${manga.status || 'N/A'}\n` +
           `🎭 Genres: ${manga.genres?.map(g => g.name).join(', ') || 'N/A'}\n\n` +
           `📝 Synopsis:\n${manga.synopsis || 'No synopsis available'}`;
}

function formatCharacterInfo(character) {
    return `👤 *${character.name}*\n\n` +
           `📺 Anime: ${character.anime || 'N/A'}\n` +
           `❤️ Favorites: ${character.favorites || 'N/A'}\n\n` +
           `📝 About:\n${character.about || 'No information available'}`;
}

// Random selector
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    downloadImage,
    formatAnimeInfo,
    formatMangaInfo,
    formatCharacterInfo,
    getRandomItem,
    sleep
};