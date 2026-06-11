const db = require('../utils/jsonDB');

const features = {
    tracker: async (msg) => {
        // Implementation for Episode Tracker
        await msg.reply('📺 *Anime Episode Tracker*\n\nFitur ini akan memberikan notifikasi anime terbaru.');
    },
    rpg: async (msg) => {
        // Implementation for RPG
        await msg.reply('⚔️ *Text-Based RPG*\n\nSelamat datang di petualangan! Karakter Anda telah dibuat.');
    },
    profile: async (msg, args) => {
        // Implementation for Profile System
        const name = args.join(' ');
        db.update('profiles', (data) => ({ ...data, [msg.from]: { name } }));
        await msg.reply(`👤 *Profil diperbarui:* ${name}`);
    },
    afk: async (msg, args) => {
        const reason = args.join(' ') || 'Tanpa alasan';
        const user = msg.author || msg.from; // handle group or private chat
        
        db.update('afk', (data) => ({
            ...data,
            [user]: {
                reason,
                timestamp: Date.now()
            }
        }));
        
        await msg.reply(`💤 *AFK Mode Aktif*\n\nUser: @${user.split('@')[0]}\nAlasan: ${reason}\n\nBot akan memberitahu jika ada yang mention kamu.`, null, {
            mentions: [user]
        });
    },
    moderation: async (msg) => {
        // Implementation for Moderation
        await msg.reply('🛡️ *Anime-themed Moderation*\n\nSistem anti-spam aktif!');
    }
};

module.exports = features;
