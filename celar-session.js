const fs = require('fs');
const path = require('path');

console.log('🗑️  Membersihkan session...\n');

const foldersToDelete = [
    './session',
    './.wwebjs_auth',
    './.wwebjs_cache'
];

let deleted = 0;

foldersToDelete.forEach(folder => {
    const fullPath = path.resolve(folder);
    
    if (fs.existsSync(fullPath)) {
        try {
            fs.rmSync(fullPath, { recursive: true, force: true });
            console.log(`✅ Deleted: ${folder}`);
            deleted++;
        } catch (error) {
            console.log(`❌ Failed to delete ${folder}:`, error.message);
        }
    } else {
        console.log(`⏭️  Skipped: ${folder} (tidak ada)`);
    }
});

console.log('');
if (deleted > 0) {
    console.log(`✅ Berhasil menghapus ${deleted} folder session!`);
    console.log('');
    console.log('💡 Sekarang jalankan bot dengan:');
    console.log('   node index.js');
    console.log('');
    console.log('📱 Kamu akan diminta scan QR code baru.');
} else {
    console.log('ℹ️  Tidak ada session yang perlu dihapus.');
    console.log('');
    console.log('💡 Bot akan generate QR code baru saat pertama run.');
}

console.log('');