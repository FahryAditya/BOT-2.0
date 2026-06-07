/**
 * Utility for member tagging
 */

/**
 * Tag a specific member
 * @param {string} phoneNumber - The phone number of the member
 * @param {string} [name] - Optional name of the member
 * @returns {string} - The WhatsApp mention format
 */
const tagMember = (phoneNumber, name) => {
    // WhatsApp mention format: @nomor
    return `@${phoneNumber.replace('@c.us', '')}`;
};

/**
 * Tag all members in a chat
 * @param {Object} chat - The chat object
 * @returns {Promise<void>}
 */
const tagAllMembers = async (chat) => {
    try {
        console.log('DEBUG: chat.isGroup =', chat.isGroup);
        // chat.participants is an array of GroupParticipant objects
        const participants = chat.participants;
        
        if (!participants) {
            throw new Error('Chat.participants is undefined. Is this a group?');
        }

        const mentions = [];
        let message = '📢 *PENGUMUMAN:* ';

        for (const participant of participants) {
            // participant.id is an object, use participant.id._serialized
            const contact = await chat.client.getContactById(participant.id._serialized);
            mentions.push(contact);
            message += `@${contact.number} `;
        }

        await chat.sendMessage(message, { mentions });
    } catch (error) {
        console.error('❌ ERROR in tagAllMembers:', error);
        throw error; // Re-throw to be caught by handleTagAll
    }
};

module.exports = { tagMember, tagAllMembers };
