const apiService = require('../apiService');
const axios = require('axios');

/**
 * Chat dengan AI (Gemini)
 * Usage: !ai apa itu anime?
 */
const aiChat = async (message, params) => {
  try {
    if (!params || params.trim() === '') {
      return message.reply('❌ Format: !ai <pertanyaan>\n\nContoh:\n!ai apa itu anime?');
    }
    
    const question = params.trim();
    
    // Show loading
    const loadingMsg = await message.reply('🤖 Gemini sedang berpikir...');
    
    // Fetch dari Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Jawab pertanyaan anime dengan singkat (max 200 char): ${question}`
              }
            ]
          }
        ]
      }
    );
    
    if (!response.data.candidates || !response.data.candidates[0].content.parts[0].text) {
        throw new Error('Invalid response from Gemini API');
    }

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    
    const finalResponse = `
🤖 *GEMINI AI RESPONSE* 🤖

❓ Pertanyaan: ${question}

✨ Jawaban:
${aiResponse}

━━━━━━━━━━━━━━━━━━━
    `.trim();

    // Check if edit is available and safe to use
    let editSuccessful = false;
    if (loadingMsg && typeof loadingMsg.edit === 'function') {
        try {
            await loadingMsg.edit(finalResponse);
            editSuccessful = true;
        } catch (e) {
            console.warn('[DEBUG] Failed to edit loading message, sending new message instead.');
        }
    }
    
    if (!editSuccessful) {
        await message.reply(finalResponse);
    }
    
  } catch (error) {
    console.error('aiChat error:', error);
    message.reply('❌ AI error. Coba lagi nanti atau pastikan GEMINI_API_KEY sudah diatur.');
  }
};

module.exports = { aiChat };
