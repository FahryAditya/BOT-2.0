const { MessageMedia } = require('whatsapp-web.js');

/**
 * Handle welcome message for new group members
 * @param {Object} notification - Notification object from whatsapp-web.js
 */
const handleWelcome = async (notification) => {
    try {
        console.log('👋 Ada member baru di grup!');
        const client = require('../index').client;
        const chat = await notification.getChat();
        
        // Iterasi semua member baru yang bergabung (recipientIds)
        for (const participantId of notification.recipientIds) {
            const contact = await client.getContactById(participantId);
            const pushName = contact.pushname || contact.number;
            
            // Format welcome message based on requirements
            const welcomeMsg = `Selamat datang ${pushName}\n\n` +
                `🌑✨- 𝙒𝙀𝙇𝘾𝙊𝙈𝙀 𝙄𝙉 -✨🌑\n` +
                `🌑✨ 𝘼𝙧𝙩𝙚𝙢𝙞𝙨𝙊𝙩𝙖𝙠𝙪. 𝙄𝘿✨🌑\n` +
                `Yuk kenalan dulu biar makin akrab 🖤\n` +
                `Komunitas anime, manga, & game\n` +
                `    🌑 𝗜𝗡𝗧𝗥𝗢 𝗗𝗨𝗟𝗨 𝗬𝗔 🌑\n` +
                `─────── ⋆⋅☆⋅⋆ ───────\n` +
                `    「 𝒄𝒂𝒓𝒅 𝒊𝒏𝒕𝒓𝒐 」\n` +
                `▃▃▃▃▃▃▃▃▃▃▃▃\n` +
                `│ ✧ ✌ salam kenal ✌ ✧\n` +
                `│┈➤✎ᝰ Nama :\n` +
                `│┈➤✎ᝰ Usia :\n` +
                `│┈➤✎ᝰ Asal Kota :\n` +
                `│┈➤✎ᝰ Hobi :\n` +
                `│┈➤✎ᝰ Waifu / Husbando :\n` +
                `╰┈┈ஜ⁀➴°\n` +
                `📝 Info pribadi tidak wajib diisi\n` +
                `───────────────\n` +
                `📌 PERHATIAN\n` +
                `• Gunakan bahasa yang sopan\n` +
                `• Tidak menggunakan gw / lu\n` +
                `• Dilarang berkata kasar\n` +
                `• Hormati sesama member`;

            try {
                // Ambil foto profile
                const profilePicUrl = await contact.getProfilePicUrl();
                
                if (profilePicUrl) {
                    const media = await MessageMedia.fromUrl(profilePicUrl);
                    await chat.sendMessage(media, {
                        caption: welcomeMsg,
                        mentions: [contact]
                    });
                } else {
                    // Jika tidak ada foto profile, kirim teks saja
                    await chat.sendMessage(welcomeMsg, {
                        mentions: [contact]
                    });
                }
            } catch (picError) {
                console.error(`⚠️ Gagal mengambil foto profil untuk ${pushName}:`, picError.message);
                // Fallback ke pesan teks saja
                await chat.sendMessage(welcomeMsg, {
                    mentions: [contact]
                });
            }
            console.log(`✅ Welcome message terkirim untuk ${pushName}`);
        }
        
    } catch (error) {
        console.error('❌ Error sending welcome message:', error.message);
    }
};

module.exports = { handleWelcome };
