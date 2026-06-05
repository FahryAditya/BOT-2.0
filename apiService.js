const axios = require('axios');
const config = require('./config');

class ApiService {
    constructor() {
        this.lastCallTime = 0;
        this.minDelay = 1500; // 1.5 detik delay antar request (Jikan limit)
    }

    async _throttle() {
        const now = Date.now();
        const timeSinceLastCall = now - this.lastCallTime;
        if (timeSinceLastCall < this.minDelay) {
            const waitTime = this.minDelay - timeSinceLastCall;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        this.lastCallTime = Date.now();
    }

    // Jikan API (MyAnimeList)
    async searchAnime(query) {
        try {
            await this._throttle();
            const response = await axios.get(`${config.api.jikan}/anime`, {
                params: { q: query, limit: 1 },
                timeout: 10000
            });
            return response.data.data[0];
        } catch (error) {
            console.error('Error searching anime:', error.message);
            return null;
        }
    }

    async searchManga(query) {
        try {
            await this._throttle();
            const response = await axios.get(`${config.api.jikan}/manga`, {
                params: { q: query, limit: 1 },
                timeout: 10000
            });
            return response.data.data[0];
        } catch (error) {
            console.error('Error searching manga:', error.message);
            return null;
        }
    }

    async searchCharacter(query) {
        try {
            await this._throttle();
            const response = await axios.get(`${config.api.jikan}/characters`, {
                params: { q: query, limit: 1 },
                timeout: 10000
            });
            const character = response.data.data[0];
            
            // Get detailed info
            if (character) {
                await this._throttle();
                const detailResponse = await axios.get(`${config.api.jikan}/characters/${character.mal_id}`, {
                    timeout: 10000
                });
                return detailResponse.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error searching character:', error.message);
            return null;
        }
    }

    async getSeasonNow() {
        try {
            await this._throttle();
            const response = await axios.get(`${config.api.jikan}/seasons/now`, {
                params: { limit: 5 },
                timeout: 10000
            });
            return response.data.data;
        } catch (error) {
            console.error('Error getting season now:', error.message);
            return null;
        }
    }

    async getTopAnime() {
        try {
            await this._throttle();
            const response = await axios.get(`${config.api.jikan}/top/anime`, {
                params: { limit: 5 },
                timeout: 10000
            });
            return response.data.data;
        } catch (error) {
            console.error('Error getting top anime:', error.message);
            return null;
        }
    }

    async getTopManga() {
        try {
            await this._throttle();
            const response = await axios.get(`${config.api.jikan}/top/manga`, {
                params: { limit: 5 },
                timeout: 10000
            });
            return response.data.data;
        } catch (error) {
            console.error('Error getting top manga:', error.message);
            return null;
        }
    }

    // Waifu APIs
    async getRandomWaifu() {
        try {
            const response = await axios.get(`${config.api.waifu}/sfw/waifu`, { timeout: 10000 });
            return response.data.url;
        } catch (error) {
            console.error('Error getting waifu:', error.message);
            return null;
        }
    }

    async searchWaifu(name) {
        try {
            await this._throttle();
            // Waifu.pics tidak support search, jadi kita pakai Jikan
            const response = await axios.get(`${config.api.jikan}/characters`, {
                params: { q: name, limit: 1 },
                timeout: 10000
            });
            
            if (response.data.data[0]) {
                return {
                    name: response.data.data[0].name,
                    image: response.data.data[0].images.jpg.image_url,
                    url: response.data.data[0].url
                };
            }
            
            // Fallback ke random waifu
            const waifuUrl = await this.getRandomWaifu();
            return { name: 'Random Waifu', image: waifuUrl };
        } catch (error) {
            console.error('Error searching waifu:', error.message);
            return null;
        }
    }

    // Anime meme
    async getAnimeMeme() {
        try {
            const response = await axios.get('https://meme-api.com/gimme/animememes', { timeout: 10000 });
            return response.data;
        } catch (error) {
            // Fallback jika API meme error
            try {
                const response = await axios.get(`${config.api.nekos}/img/gecg`, { timeout: 10000 });
                return { url: response.data.url, title: 'Random Anime Meme' };
            } catch (err) {
                console.error('Error getting meme:', err.message);
                return null;
            }
        }
    }

    // Random anime quote
    async getRandomQuote() {
        try {
            const response = await axios.get(`${config.api.animechan}/random`, { timeout: 10000 });
            return response.data;
        } catch (error) {
            console.error('Error getting quote:', error.message);
            return null;
        }
    }
}

module.exports = new ApiService();