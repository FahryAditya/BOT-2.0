const axios = require('axios');
const config = require('../config');
const { formatGenreList, findGenreByName, getRandomGenre } = require('../genreData');
const { downloadImage } = require('../helpers');

// Handler untuk !animegenre
async function handleAnimeGenre(msg) {
    const genreList = formatGenreList();
    await msg.reply(genreList);
}

// Handler untuk !searchgenre <nama_genre>
async function handleSearchGenre(msg, args) {
    if (args.length === 0) {
        return msg.reply(
            '❌ Gunakan: !searchgenre <nama_genre>\n\n' +
            '📝 Contoh:\n' +
            '• !searchgenre Action\n' +
            '• !searchgenre Romance\n' +
            '• !searchgenre Isekai\n\n' +
            '💡 Ketik !animegenre untuk melihat daftar genre'
        );
    }
    
    const genreName = args.join(' ');
    const genre = findGenreByName(genreName);
    
    if (!genre) {
        return msg.reply(
            `❌ Genre "${genreName}" tidak ditemukan!\n\n` +
            `💡 Ketik !animegenre untuk melihat daftar genre yang tersedia.`
        );
    }
    
    await msg.reply(`🔍 Mencari anime dengan genre *${genre.name}* ${genre.emoji}...`);
    
    try {
        const response = await axios.get(`${config.api.jikan}/anime`, {
            params: {
                genres: genre.id,
                order_by: 'score',
                sort: 'desc',
                limit: 10
            }
        });
        
        const animes = response.data.data;
        
        if (!animes || animes.length === 0) {
            return msg.reply(`❌ Tidak ada anime ditemukan untuk genre ${genre.name}!`);
        }
        
        // Format hasil pencarian
        let result = `${genre.emoji} *ANIME GENRE: ${genre.name.toUpperCase()}* ${genre.emoji}\n\n`;
        result += `📊 Top ${animes.length} Anime:\n\n`;
        
        animes.forEach((anime, index) => {
            result += `${index + 1}. *${anime.title}*\n`;
            result += `   ⭐ Score: ${anime.score || 'N/A'}\n`;
            result += `   📺 Episodes: ${anime.episodes || '?'}\n`;
            result += `   📅 Year: ${anime.year || 'N/A'}\n`;
            
            if (anime.synopsis) {
                const shortSynopsis = anime.synopsis.substring(0, 100) + '...';
                result += `   📝 ${shortSynopsis}\n`;
            }
            result += '\n';
        });
        
        result += `💡 *Tip:* Gunakan !manga <judul> untuk info lebih detail!`;
        
        await msg.reply(result);
        
        // Kirim gambar anime pertama sebagai preview
        if (animes[0].images?.jpg?.large_image_url) {
            const media = await downloadImage(animes[0].images.jpg.large_image_url);
            if (media) {
                await msg.reply(media, null, { 
                    caption: `🎬 Preview: *${animes[0].title}*` 
                });
            }
        }
        
    } catch (error) {
        console.error('Error searching genre:', error);
        await msg.reply('❌ Terjadi error saat mencari anime!');
    }
}

// Handler untuk !randomgenre (bonus feature)
async function handleRandomGenre(msg) {
    const genre = getRandomGenre();
    
    await msg.reply(
        `🎲 *GENRE RANDOM!*\n\n` +
        `${genre.emoji} Genre: *${genre.name}*\n\n` +
        `Ketik !searchgenre ${genre.name} untuk melihat anime dengan genre ini!`
    );
}

module.exports = {
    handleAnimeGenre,
    handleSearchGenre,
    handleRandomGenre
};