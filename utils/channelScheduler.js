const cron = require('node-cron');
const channelCommands = require('../commands/channelCommands');

/**
 * Setup scheduled channel updates
 * 
 * 08:00 WIB - Random Character Update
 * 14:00 WIB - Random Anime Update
 * 19:00 WIB - Top Manga Update
 */
const setupChannelScheduler = () => {
  console.log('📅 Initializing channel scheduler...');
  
  // 08:00 WIB - Character Update
  // Cron format: minute hour day month weekday
  // 0 8 = 08:00
  cron.schedule('0 8 * * *', async () => {
    console.log('⏰ 08:00 WIB - Running character update...');
    try {
      await channelCommands.randomCharacterUpdate();
    } catch (error) {
      console.error('Scheduled character update error:', error);
    }
  }, {
    timezone: "Asia/Jakarta" // WIB timezone
  });
  
  // 14:00 WIB - Anime Update
  cron.schedule('0 14 * * *', async () => {
    console.log('⏰ 14:00 WIB - Running anime update...');
    try {
      await channelCommands.randomAnimeUpdate();
    } catch (error) {
      console.error('Scheduled anime update error:', error);
    }
  }, {
    timezone: "Asia/Jakarta"
  });
  
  // 19:00 WIB - Manga Update
  cron.schedule('0 19 * * *', async () => {
    console.log('⏰ 19:00 WIB - Running manga update...');
    try {
      await channelCommands.topMangaUpdate();
    } catch (error) {
      console.error('Scheduled manga update error:', error);
    }
  }, {
    timezone: "Asia/Jakarta"
  });
  
  console.log('✅ Channel scheduler initialized!');
};

module.exports = { setupChannelScheduler };