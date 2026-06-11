const db = require('./jsonDB');

// Simple in-memory rate limiter & cooldown
const lastRequestTime = new Map();
const COOLDOWN_MS = 3000; // 3 seconds cooldown between commands

const security = {
    // Command Cooldown per User
    isRateLimited: (userId) => {
        const now = Date.now();
        const lastTime = lastRequestTime.get(userId) || 0;
        
        if (now - lastTime < COOLDOWN_MS) {
            return true;
        }
        
        lastRequestTime.set(userId, now);
        
        // Cleanup map periodically
        if (lastRequestTime.size > 1000) {
            const entries = Array.from(lastRequestTime.entries());
            for (const [key, value] of entries) {
                if (now - value > COOLDOWN_MS * 10) lastRequestTime.delete(key);
            }
        }
        
        return false;
    },

    // Blacklist check
    isBanned: (userId) => {
        const blacklist = db.get('blacklist');
        // Pastikan blacklist adalah array, jika tidak, kembalikan false (tidak banned)
        if (!Array.isArray(blacklist)) return false;
        return blacklist.includes(userId);
    },

    // Input sanitization
    sanitize: (input) => {
        if (typeof input !== 'string') return '';
        // Remove potential dangerous characters for basic protection
        return input.replace(/[<>]/g, '');
    }
};

module.exports = security;
