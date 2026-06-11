const { MessageMedia } = require('whatsapp-web.js');

const mediaCommands = {
    /**
     * !sticker [judul] - Convert image to sticker
     */
    makeSticker: async (msg, args) => {
        try {
            console.log('[DEBUG] !sticker command received');
            const isImage = msg.type === 'image';
            const isQuotedImage = msg.hasQuotedMsg && (await msg.getQuotedMessage()).type === 'image';

            if (!isImage && !isQuotedImage) {
                return msg.reply('❌ Kirim gambar atau reply gambar dengan caption *!sticker [judul]*');
            }

            const quote = msg.hasQuotedMsg ? await msg.getQuotedMessage() : msg;
            
            let stickerName = args.join(' ');
            if (stickerName.startsWith('*')) stickerName = stickerName.substring(1).trim();
            if (!stickerName) stickerName = 'Anime Bot Sticker';

            await msg.reply('⏳ *Processing sticker...*');

            console.log('[DEBUG] Downloading media...');
            const media = await quote.downloadMedia();
            if (!media) {
                console.error('[ERROR] Failed to download media');
                return msg.reply('❌ Gagal mengunduh gambar.');
            }

            console.log('[DEBUG] Media downloaded, mimeType:', media.mimetype);
            console.log('[DEBUG] Sending media as sticker...');
            
            await msg.reply(media, undefined, {
                sendMediaAsSticker: true,
                stickerName: stickerName,
                stickerAuthor: 'Anthropic Bot'
            });
            
            console.log('[DEBUG] Sticker sent successfully');

        } catch (error) {
            console.error('[ERROR] makeSticker Error:', error);
            msg.reply('❌ Terjadi kesalahan saat membuat stiker.');
        }
    },

    /**
     * !gif [teks/none] - Convert video to GIF
     */
    makeGif: async (msg, args) => {
        try {
            console.log('[DEBUG] !gif command received');
            const isVideo = msg.type === 'video';
            const isQuotedVideo = msg.hasQuotedMsg && (await msg.getQuotedMessage()).type === 'video';

            if (!isVideo && !isQuotedVideo) {
                return msg.reply('❌ Kirim video atau reply video dengan caption *!gif [teks/none]*');
            }

            const quote = msg.hasQuotedMsg ? await msg.getQuotedMessage() : msg;
            
            await msg.reply('⏳ *Processing GIF...* (Harap tunggu, video sedang dikonversi)');

            console.log('[DEBUG] Downloading video...');
            const media = await quote.downloadMedia();
            if (!media) {
                console.error('[ERROR] Failed to download video');
                return msg.reply('❌ Gagal mengunduh video.');
            }

            console.log('[DEBUG] Video downloaded, mimeType:', media.mimetype);
            const captionText = args[0]?.toLowerCase() === 'none' ? '' : args.join(' ');

            console.log('[DEBUG] Sending media as GIF...');
            await msg.reply(media, undefined, {
                sendVideoAsGif: true,
                caption: captionText
            });
            console.log('[DEBUG] GIF sent successfully');

        } catch (error) {
            console.error('[ERROR] makeGif Error:', error);
            msg.reply('❌ Terjadi kesalahan saat membuat GIF. Pastikan durasi video pendek (< 10 detik).');
        }
    }
};

module.exports = mediaCommands;
