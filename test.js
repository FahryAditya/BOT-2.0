// Test script untuk debug command handlers
const config = require('./config');

console.log('🧪 Testing Bot Configuration...\n');

console.log('📋 Config loaded:');
console.log('- Prefix:', config.prefix);
console.log('- Bot Name:', config.botName);
console.log('- Owner:', config.ownerName);
console.log('');

// Test command parsing
function testCommandParsing(message) {
    console.log(`Testing: "${message}"`);
    
    if (!message.startsWith(config.prefix)) {
        console.log('  ❌ Not a command (no prefix)');
        return;
    }
    
    const args = message.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    console.log(`  ✅ Command: "${command}"`);
    console.log(`  ✅ Args:`, args);
    console.log('');
}

// Test cases
console.log('🧪 Testing Command Parsing:\n');
testCommandParsing('!ping');
testCommandParsing('!menu');
testCommandParsing('!manga Naruto');
testCommandParsing('!searchgenre Action');
testCommandParsing('hello world');
testCommandParsing('!');

// Test module imports
console.log('🧪 Testing Module Imports:\n');

try {
    const { handlePing, handleMenu } = require('./commands/basicCommands');
    console.log('✅ basicCommands loaded');
    console.log('  - handlePing:', typeof handlePing);
    console.log('  - handleMenu:', typeof handleMenu);
} catch (error) {
    console.log('❌ basicCommands failed:', error.message);
}

try {
    const animeCommands = require('./commands/animeCommands');
    console.log('✅ animeCommands loaded');
} catch (error) {
    console.log('❌ animeCommands failed:', error.message);
}

try {
    const absurdCommands = require('./commands/absurdCommands');
    console.log('✅ absurdCommands loaded');
} catch (error) {
    console.log('❌ absurdCommands failed:', error.message);
}

try {
    const waifuCommands = require('./commands/waifuCommands');
    console.log('✅ waifuCommands loaded');
} catch (error) {
    console.log('❌ waifuCommands failed:', error.message);
}

try {
    const genreCommands = require('./commands/genreCommands');
    console.log('✅ genreCommands loaded');
} catch (error) {
    console.log('❌ genreCommands failed:', error.message);
}

try {
    const quizManager = require('./quizManager');
    console.log('✅ quizManager loaded');
} catch (error) {
    console.log('❌ quizManager failed:', error.message);
}

console.log('\n✅ All tests completed!');