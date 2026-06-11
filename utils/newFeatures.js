const axios = require('axios');
const db = require('./jsonDB');
const userStats = require('./userStats');

const safariTiers = [
    { tier: 'COMMON', chance: 0.6, rewardRange: [100, 200], waifus: ['Sakura Haruno', 'Nami', 'Lucy Heartfilia', 'Aqua', 'Winry Rockbell'] },
    { tier: 'RARE', chance: 0.25, rewardRange: [300, 600], waifus: ['Mikasa Ackerman', 'Rem', 'Emilia', 'Erza Scarlet', 'Hinata Hyuga'] },
    { tier: 'SUPER RARE', chance: 0.1, rewardRange: [1000, 2000], waifus: ['Saber', 'Asuna Yuuki', 'Zero Two', 'Makima', 'Yor Forger'] },
    { tier: 'LEGENDARY', chance: 0.05, rewardRange: [5000, 10000], waifus: ['Kaguya Otsutsuki', 'Madoka Magica', 'Esdeath', 'Albedo', 'Boa Hancock'] }
];

const features = {
    /**
     * !waifusafari - Hunt for waifus and rewards
     */
    waifuSafari: async (msg) => {
        const user = msg.author || msg.from;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        const now = Date.now();
        const cooldown = 4 * 60 * 60 * 1000; // 4 hours

        if (now - (stats.lastSafari || 0) < cooldown) {
            const remaining = cooldown - (now - (stats.lastSafari || 0));
            const hours = Math.floor(remaining / (60 * 60 * 1000));
            const mins = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
            return msg.reply(`🏹 *Waifu Safari*\n\nKamu masih lelah setelah berburu. Tunggu ${hours}j ${mins}m lagi.`);
        }

        await msg.reply('🏹 *Entering the Safari Zone...* 🍃\nMencari jejak waifu liar...');

        // Random Delay for effect
        await new Promise(r => setTimeout(r, 2000));

        const rand = Math.random();
        let selectedTier = safariTiers[0];
        let accumulatedChance = 0;

        for (const tier of safariTiers) {
            accumulatedChance += tier.chance;
            if (rand <= accumulatedChance) {
                selectedTier = tier;
                break;
            }
        }

        const waifu = selectedTier.waifus[Math.floor(Math.random() * selectedTier.waifus.length)];
        const points = Math.floor(Math.random() * (selectedTier.rewardRange[1] - selectedTier.rewardRange[0] + 1)) + selectedTier.rewardRange[0];

        await userStats.addPoints(user, points);
        await userStats.updateUser(user, { lastSafari: now });

        const safariMsg = `
✨ *SAFARI RESULT* ✨
━━━━━━━━━━━━━━━━━━━
🌿 Area: *${selectedTier.tier} ZONE*
👤 Encounter: *${waifu}*
💰 Reward: *+${points} points*

_Kamu berhasil menjalin bonding dengan ${waifu} dan mendapatkan hadiah!_
━━━━━━━━━━━━━━━━━━━
        `.trim();

        await msg.reply(safariMsg);
    },

    /**
     * !detectanime - Search anime by image (Uses Trace.moe API)
     */
    detectAnime: async (msg) => {
        if (!msg.hasQuotedMsg && msg.type !== 'image') {
            return msg.reply('❌ Kirim gambar atau reply gambar dengan caption *!detectanime* untuk mencari judulnya!');
        }

        const quote = msg.hasQuotedMsg ? await msg.getQuotedMessage() : msg;
        if (quote.type !== 'image') return msg.reply('❌ Itu bukan gambar!');

        await msg.reply('🔍 *Analyzing image...* (Trace.moe)');

        try {
            const media = await quote.downloadMedia();
            const response = await axios.post('https://api.trace.moe/search', Buffer.from(media.data, 'base64'), {
                headers: { 'Content-Type': 'image/jpeg' }
            });

            if (!response.data.result || response.data.result.length === 0) {
                return msg.reply('❌ Maaf, judul anime tidak ditemukan.');
            }

            const bestMatch = response.data.result[0];
            const similarity = (bestMatch.similarity * 100).toFixed(2);
            
            // Get more info from Jikan
            let extraInfo = '';
            try {
                const jikanRes = await axios.get(`https://api.jikan.moe/v4/anime/${bestMatch.anilist}`);
                const anime = jikanRes.data.data;
                extraInfo = `\n⭐ *Score:* ${anime.score || 'N/A'}\n📅 *Aired:* ${anime.aired.string}`;
            } catch (e) {}

            const resultMsg = `
🎬 *ANIME DETECTOR* 🎬
━━━━━━━━━━━━━━━━━━━
📺 *Judul:* ${bestMatch.filename.split(']')[1] || bestMatch.filename}
🎯 *Similarity:* ${similarity}%
🎞️ *Episode:* ${bestMatch.episode || 'N/A'}
⏱️ *Timestamp:* ${new Date(bestMatch.from * 1000).toISOString().substr(11, 8)}${extraInfo}

_Hasil deteksi berdasarkan kemiripan visual._
━━━━━━━━━━━━━━━━━━━
            `.trim();

            await msg.reply(resultMsg);
        } catch (error) {
            console.error('detectAnime Error:', error);
            msg.reply('❌ Terjadi kesalahan saat menghubungi server Trace.moe.');
        }
    },

    /**
     * !animenews - Fetch latest anime news from Jikan API
     */
    animeNews: async (msg) => {
        await msg.reply('📰 *Fetching latest anime news...*');

        try {
            // Jikan doesn't have a direct "global news" endpoint that's easy to use without specific ID
            // So we fetch news from top ongoing anime
            const topRes = await axios.get('https://api.jikan.moe/v4/top/anime?filter=airing&limit=1');
            const animeId = topRes.data.data[0].mal_id;
            
            const newsRes = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}/news`);
            const newsList = newsRes.data.data.slice(0, 3);

            if (newsList.length === 0) return msg.reply('❌ Tidak ada berita terbaru saat ini.');

            let newsMsg = `📰 *LATEST ANIME NEWS* 📰\n━━━━━━━━━━━━━━━━━━━\n\n`;
            
            newsList.forEach((n, i) => {
                newsMsg += `${i + 1}. *${n.title}*\n`;
                newsMsg += `🔗 ${n.url}\n\n`;
            });

            newsMsg += `━━━━━━━━━━━━━━━━━━━\n_Source: MyAnimeList_`;
            await msg.reply(newsMsg);
        } catch (error) {
            console.error('animeNews Error:', error);
            msg.reply('❌ Gagal mengambil berita. API mungkin sedang limit.');
        }
    }
};

module.exports = features;
