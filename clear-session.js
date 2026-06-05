const fs = require('fs');
const path = require('path');

console.log('Membersihkan session...\n');

const foldersToDelete = [
    './session',
    './.wwebjs_auth',
    './.wwebjs_cache'
];

let deleted = 0;

for (const folder of foldersToDelete) {
    const fullPath = path.resolve(folder);

    if (!fs.existsSync(fullPath)) {
        console.log(`Skipped: ${folder} (tidak ada)`);
        continue;
    }

    try {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`Deleted: ${folder}`);
        deleted++;
    } catch (error) {
        console.log(`Failed to delete ${folder}: ${error.message}`);
    }
}

console.log('');

if (deleted > 0) {
    console.log(`Berhasil menghapus ${deleted} folder session.`);
    console.log('Sekarang jalankan: node index.js');
    console.log('Kamu akan diminta scan QR code baru.');
} else {
    console.log('Tidak ada session yang perlu dihapus.');
    console.log('Bot akan generate QR code baru saat pertama run.');
}
