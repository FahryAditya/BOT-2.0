const apiService = require('../apiService');
const { downloadImage, getRandomItem } = require('../helpers');
const quizManager = require('../quizManager');

// Data untuk quiz waifu
const waifuQuizData = [
    {
        clue: "Dia punya mata merah, suka makan dan punya kekuatan regenerasi super. Tapi dia bukan vampire loh!",
        answer: "Nezuko",
        anime: "Demon Slayer",
        hints: ["Demon", "Bamboo", "Pink kimono"]
    },
    {
        clue: "Dia tsundere level dewa, rambutnya twin tail, dan suka bilang 'It's not like I like you or anything!'",
        answer: "Asuka",
        anime: "Evangelion",
        hints: ["Pilot", "EVA-02", "German"]
    },
    {
        clue: "Waifu dengan pita merah besar di kepala, pendiam tapi mematikan dengan katana",
        answer: "Akame",
        anime: "Akame ga Kill",
        hints: ["Assassin", "Murasame", "Night Raid"]
    },
    {
        clue: "Gadis dengan hammer raksasa yang bisa muncul dari nowhere, cheerful banget!",
        answer: "Rikka Takanashi",
        anime: "Chuunibyou",
        hints: ["Eye patch", "Chuunibyou", "Wicked Eye"]
    },
    {
        clue: "Rambut pink, kekuatan super strength, tapi sifatnya polos dan lucu!",
        answer: "Sakura",
        anime: "Naruto",
        hints: ["Kunoichi", "Medical ninja", "Konoha"]
    },
    {
        clue: "Gadis dere-dere dengan rambut biru panjang yang setia banget sama protagonis",
        answer: "Rem",
        anime: "Re:Zero",
        hints: ["Maid", "Twins", "Blue hair"]
    }
];

async function handleCariWaifu(msg, args) {
    if (args.length === 0) {
        return msg.reply('❌ Gunakan: !cariwaifu <nama>\nContoh: !cariwaifu Nezuko');
    }
    
    const query = args.join(' ');
    await msg.reply('💕 Mencari waifu kamu...');
    
    const waifu = await apiService.searchWaifu(query);
    
    if (!waifu) {
        return msg.reply('❌ Waifu tidak ditemukan! Coba nama lain.');
    }
    
    const media = await downloadImage(waifu.image);
    
    const caption = `💕 *${waifu.name}*\n\n` +
                   `Ini dia waifu yang kamu cari! ✨\n` +
                   (waifu.url ? `\n🔗 Info lebih: ${waifu.url}` : '');
    
    if (media) {
        await msg.reply(media, null, { caption });
    } else {
        await msg.reply(caption);
    }
}

async function handleRandomWaifu(msg) {
    await msg.reply('💕 Mengambil random waifu...');
    
    const waifuUrl = await apiService.getRandomWaifu();
    
    if (!waifuUrl) {
        return msg.reply('❌ Gagal mengambil waifu!');
    }
    
    const media = await downloadImage(waifuUrl);
    
    if (media) {
        await msg.reply(media, null, { 
            caption: '💕 *Random Waifu*\n\nIni dia waifu random untuk kamu! Suka ga? 😊' 
        });
    } else {
        await msg.reply('❌ Gagal mendownload gambar waifu!');
    }
}

async function handleWaifuQuiz(msg) {
    const chatId = msg.from;
    
    // Cek apakah sudah ada quiz aktif
    if (quizManager.hasActiveSession(chatId)) {
        return msg.reply(
            '⚠️ Kamu masih punya quiz aktif!\n\n' +
            'Selesaikan dulu atau ketik !skipquiz untuk skip.'
        );
    }
    
    const quiz = getRandomItem(waifuQuizData);
    
    // Create quiz session
    quizManager.createSession(
        chatId, 
        'waifu', 
        quiz.clue, 
        quiz.answer,
        quiz.hints
    );
    
    await msg.reply(
        `💕 *WAIFU QUIZ!*\n\n` +
        `🎮 *Tebak waifu dari petunjuk ini:*\n\n` +
        `${quiz.clue}\n\n` +
        `📺 *Anime:* ${quiz.anime}\n` +
        `💡 *Hints:* ${quiz.hints.join(', ')}\n\n` +
        `📝 Balas pesan ini dengan jawabanmu!\n` +
        `⏰ Waktu: 10 menit\n\n` +
        `_Ketik !skipquiz untuk skip_`
    );
}

async function handleOtakudesu(msg) {
    // Rekomendasi anime berdasarkan mood random
    const moods = [
        { mood: '😊 Happy', genres: 'Comedy, Slice of Life' },
        { mood: '😢 Sad', genres: 'Drama, Romance' },
        { mood: '😎 Epic', genres: 'Action, Adventure' },
        { mood: '🤔 Thinking', genres: 'Mystery, Psychological' },
        { mood: '😱 Thrilled', genres: 'Horror, Thriller' },
        { mood: '💕 Romance', genres: 'Romance, Shoujo' }
    ];
    
    const selectedMood = getRandomItem(moods);
    
    await msg.reply(
        `🎌 *REKOMENDASI ANIME*\n\n` +
        `Mood kamu hari ini: ${selectedMood.mood}\n\n` +
        `📺 *Genre yang cocok:*\n${selectedMood.genres}\n\n` +
        `💡 Coba search anime dengan genre ini menggunakan !animegenre atau !searchgenre!`
    );
}

module.exports = {
    handleCariWaifu,
    handleRandomWaifu,
    handleWaifuQuiz,
    handleOtakudesu
};