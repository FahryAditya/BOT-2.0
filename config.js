module.exports = {
    prefix: '!',
    botName: 'Anime Bot',
    ownerName: 'Admin',
    
    // API Endpoints
    api: {
        jikan: 'https://api.jikan.moe/v4',
        waifu: 'https://api.waifu.pics',
        waifuim: 'https://api.waifu.im',
        animechan: 'https://animechan.xyz/api',
        nekos: 'https://nekos.life/api/v2'
    },
    
    // Pesan Welcome
    welcomeMessage: (username) => {
        return `🎌 *Selamat Datang!* 🎌\n\n` +
               `Hai @${username}! 👋\n` +
               `Selamat bergabung di *Artemis Lunar Group*!\n\n` +
               `Ketik *!menu* untuk melihat fitur bot anime kami! ✨`;
    }
};