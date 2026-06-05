// Sistem untuk menyimpan active quiz sessions
class QuizManager {
    constructor() {
        // Format: { chatId: { type, question, answer, timestamp } }
        this.activeSessions = new Map();
        
        // Cleanup expired sessions setiap 5 menit
        const cleanupTimer = setInterval(() => this.cleanupExpiredSessions(), 5 * 60 * 1000);
        cleanupTimer.unref?.();
    }
    
    // Buat session quiz baru
    createSession(chatId, quizType, question, answer, hints = []) {
        const session = {
            type: quizType, // 'anime', 'waifu', atau 'character'
            question: question,
            answer: answer.toLowerCase().trim(),
            hints: hints,
            timestamp: Date.now(),
            attempts: 0
        };
        
        this.activeSessions.set(chatId, session);
        console.log(`✅ Quiz session created for ${chatId}`);
        return session;
    }
    
    // Cek apakah ada active session
    hasActiveSession(chatId) {
        return this.activeSessions.has(chatId);
    }
    
    // Dapatkan session
    getSession(chatId) {
        return this.activeSessions.get(chatId);
    }
    
    // Validasi jawaban
    checkAnswer(chatId, userAnswer) {
        const session = this.getSession(chatId);
        if (!session) return null;
        
        session.attempts++;
        
        const normalizedAnswer = userAnswer.toLowerCase().trim();
        const correctAnswer = session.answer;
        
        // Check exact match
        if (normalizedAnswer === correctAnswer) {
            this.deleteSession(chatId);
            return {
                correct: true,
                attempts: session.attempts,
                answer: correctAnswer
            };
        }
        
        // Check partial match (similarity)
        if (this.isSimilar(normalizedAnswer, correctAnswer)) {
            this.deleteSession(chatId);
            return {
                correct: true,
                attempts: session.attempts,
                answer: correctAnswer,
                partial: true
            };
        }
        
        return {
            correct: false,
            attempts: session.attempts,
            hint: session.attempts >= 2 ? session.hints[0] : null
        };
    }
    
    // Hapus session
    deleteSession(chatId) {
        const deleted = this.activeSessions.delete(chatId);
        if (deleted) {
            console.log(`🗑️ Quiz session deleted for ${chatId}`);
        }
        return deleted;
    }
    
    // Check similarity (untuk typo kecil)
    isSimilar(str1, str2) {
        // Remove special characters dan spaces
        const clean1 = str1.replace(/[^a-z0-9]/gi, '').toLowerCase();
        const clean2 = str2.replace(/[^a-z0-9]/gi, '').toLowerCase();
        
        // Jika panjangnya beda jauh, bukan similar
        if (Math.abs(clean1.length - clean2.length) > 3) return false;
        
        // Check if one contains the other
        if (clean1.includes(clean2) || clean2.includes(clean1)) return true;
        
        // Levenshtein distance untuk typo kecil
        const distance = this.levenshteinDistance(clean1, clean2);
        const maxLength = Math.max(clean1.length, clean2.length);
        const similarity = 1 - distance / maxLength;
        
        // 80% similarity = dianggap benar
        return similarity >= 0.8;
    }
    
    // Levenshtein distance algorithm
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }
    
    // Cleanup expired sessions (lebih dari 10 menit)
    cleanupExpiredSessions() {
        const now = Date.now();
        const maxAge = 10 * 60 * 1000; // 10 menit
        
        for (const [chatId, session] of this.activeSessions.entries()) {
            if (now - session.timestamp > maxAge) {
                this.deleteSession(chatId);
                console.log(`⏰ Expired quiz session removed for ${chatId}`);
            }
        }
    }
    
    // Get statistics
    getStats() {
        return {
            activeSessions: this.activeSessions.size,
            sessions: Array.from(this.activeSessions.entries()).map(([chatId, session]) => ({
                chatId,
                type: session.type,
                attempts: session.attempts,
                age: Math.floor((Date.now() - session.timestamp) / 1000) + 's'
            }))
        };
    }
}

// Export singleton instance
module.exports = new QuizManager();
