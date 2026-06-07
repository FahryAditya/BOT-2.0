const db = require('../utils/jsonDB');

const games = {
    shiritori: async (msg) => {
        // Implementation for Shiritori
        await msg.reply('🎮 *Anime Shiritori*\n\nSebutkan nama karakter/anime yang berawalan dari huruf terakhir kata sebelumnya!');
    },
    emojiRiddles: async (msg) => {
        // Implementation for Emoji Riddles
        await msg.reply('🧩 *Emoji Riddles*\n\nTebak judul anime dari susunan emoji berikut: 🏴‍☠️👒🍖');
    },
    scrambledNames: async (msg) => {
        // Implementation for Scrambled Names
        await msg.reply('🔀 *Scrambled Names*\n\nSusun nama karakter ini: "N-A-R-U-T-O" -> O-T-U-R-A-N');
    },
    guessScene: async (msg) => {
        // Implementation for Guess Scene
        await msg.reply('🎬 *Guess Scene*\n\nTebak anime dari adegan: Seorang anak kecil kehilangan ibunya di hutan dan bertemu roh...');
    },
    hangman: async (msg) => {
        // Implementation for Hangman
        await msg.reply('🪢 *Anime Hangman*\n\nTebak judul anime: _ _ R U T _');
    },
    compatibility: async (msg, args) => {
        // Implementation for Waifu Compatibility
        const user = msg.from;
        const name = args.join(' ') || 'User';
        const score = Math.floor(Math.random() * 101);
        db.update('compatibility', (data) => ({ ...data, [user]: score }));
        await msg.reply(`💕 *Waifu Compatibility*\n\nTingkat kecocokan ${name} adalah ${score}%!`);
    }
};

module.exports = games;
