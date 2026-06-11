const axios = require('axios');
const config = require('./config');

class ApiService {
    constructor() {
        this.lastCallTime = 0;
        this.minDelay = 1500; // 1.5 detik delay antar request (Jikan limit)
        this.cache = new Map();
        this.cacheTTL = 30 * 60 * 1000; // 30 menit cache
    }

    _getCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
            return cached.data;
        }
        return null;
    }

    _setCache(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
        // Cleanup cache if too large
        if (this.cache.size > 100) {
            const keys = Array.from(this.cache.keys());
            this.cache.delete(keys[0]);
        }
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
        const cacheKey = `anime_${query.toLowerCase()}`;
        const cached = this._getCache(cacheKey);
        if (cached) return cached;

        try {
            await this._throttle();
            const response = await axios.get(`${config.api.jikan}/anime`, {
                params: { q: query, limit: 1 },
                timeout: 10000
            });
            const data = response.data.data[0];
            if (data) this._setCache(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Error searching anime:', error.message);
            return null;
        }
    }

    async searchManga(query) {
        const cacheKey = `manga_${query.toLowerCase()}`;
        const cached = this._getCache(cacheKey);
        if (cached) return cached;

        try {
            await this._throttle();
            const response = await axios.get(`${config.api.jikan}/manga`, {
                params: { q: query, limit: 1 },
                timeout: 10000
            });
            const data = response.data.data[0];
            if (data) this._setCache(cacheKey, data);
            return data;
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

    // Dynamic Quiz Data
    async getRandomAnimeFromYear(year) {
        try {
            await this._throttle();
            // Ambil anime populer dari tahun tertentu
            const response = await axios.get(`${config.api.jikan}/anime`, {
                params: { 
                    start_date: `${year}-01-01`, 
                    order_by: 'popularity', 
                    sort: 'asc',
                    limit: 25,
                    status: 'complete'
                },
                timeout: 10000
            });
            
            const animeList = response.data.data;
            if (!animeList || animeList.length === 0) return null;
            
            // Pilih satu secara acak dari top 25
            return animeList[Math.floor(Math.random() * animeList.length)];
        } catch (error) {
            console.error('Error getting random anime from year:', error.message);
            return null;
        }
    }

    async getAnimeThemes(mal_id) {
        try {
            await this._throttle();
            const response = await axios.get(`${config.api.jikan}/anime/${mal_id}/themes`, {
                timeout: 10000
            });
            return response.data.data;
        } catch (error) {
            console.error('Error getting anime themes:', error.message);
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

    // AI Chat
    async askGemini(prompt) {
        try {
            console.log('DEBUG: GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
            if (!process.env.GEMINI_API_KEY) {
                console.error('GEMINI_API_KEY not set');
                return '❌ AI Service tidak tersedia (API Key belum diatur).';
            }
            
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
                {
                    contents: [{ parts: [{ text: prompt }] }]
                },
                { timeout: 15000 }
            );
            
            return response.data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error asking Gemini:', error.message);
            return '❌ Gagal mendapatkan jawaban dari AI.';
        }
    }
}

module.exports = new ApiService();