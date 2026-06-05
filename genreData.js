// Daftar lengkap genre anime dengan ID dari MyAnimeList API
const animeGenres = [
    { id: 1, name: 'Action', emoji: '⚔️' },
    { id: 2, name: 'Adventure', emoji: '🗺️' },
    { id: 4, name: 'Comedy', emoji: '😂' },
    { id: 8, name: 'Drama', emoji: '🎭' },
    { id: 10, name: 'Fantasy', emoji: '✨' },
    { id: 14, name: 'Horror', emoji: '👻' },
    { id: 7, name: 'Mystery', emoji: '🔍' },
    { id: 22, name: 'Romance', emoji: '💕' },
    { id: 24, name: 'Sci-Fi', emoji: '🚀' },
    { id: 36, name: 'Slice of Life', emoji: '🌸' },
    { id: 30, name: 'Sports', emoji: '⚽' },
    { id: 37, name: 'Supernatural', emoji: '👹' },
    { id: 41, name: 'Thriller', emoji: '😱' },
    { id: 9, name: 'Ecchi', emoji: '🔞' },
    { id: 49, name: 'Isekai', emoji: '🌍' },
    { id: 18, name: 'Mecha', emoji: '🤖' },
    { id: 38, name: 'Military', emoji: '🪖' },
    { id: 19, name: 'Music', emoji: '🎵' },
    { id: 39, name: 'Police', emoji: '👮' },
    { id: 40, name: 'Psychological', emoji: '🧠' },
    { id: 23, name: 'School', emoji: '🏫' },
    { id: 25, name: 'Shoujo', emoji: '💖' },
    { id: 27, name: 'Shounen', emoji: '💪' },
    { id: 42, name: 'Seinen', emoji: '🔥' },
    { id: 43, name: 'Josei', emoji: '👩' },
    { id: 31, name: 'Super Power', emoji: '⚡' },
    { id: 32, name: 'Vampire', emoji: '🧛' },
    { id: 50, name: 'Adult Cast', emoji: '👔' },
    { id: 13, name: 'Historical', emoji: '🏛️' },
    { id: 46, name: 'Award Winning', emoji: '🏆' }
];

// Fungsi untuk format daftar genre
function formatGenreList() {
    let message = '🎌 *DAFTAR GENRE ANIME LENGKAP* 🎌\n\n';
    message += 'Gunakan command berikut untuk mencari anime berdasarkan genre:\n\n';
    message += '`!searchgenre <nama_genre>`\n\n';
    message += '📚 *Genre yang tersedia:*\n\n';
    
    animeGenres.forEach((genre, index) => {
        message += `${genre.emoji} *${genre.name}*\n`;
        if ((index + 1) % 5 === 0) {
            message += '\n';
        }
    });
    
    message += '\n📝 *Contoh penggunaan:*\n';
    message += '• !searchgenre Action\n';
    message += '• !searchgenre Romance\n';
    message += '• !searchgenre Isekai\n\n';
    message += '💡 *Tip:* Kamu juga bisa kombinasikan dengan command lain!';
    
    return message;
}

// Fungsi untuk mencari genre berdasarkan nama
function findGenreByName(genreName) {
    return animeGenres.find(
        g => g.name.toLowerCase() === genreName.toLowerCase()
    );
}

// Fungsi untuk mendapatkan genre random
function getRandomGenre() {
    return animeGenres[Math.floor(Math.random() * animeGenres.length)];
}

module.exports = {
    animeGenres,
    formatGenreList,
    findGenreByName,
    getRandomGenre
};