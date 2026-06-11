const { initializeDatabase } = require('./utils/neonDB');

async function verify() {
    console.log('--- Database Verification ---');
    const success = await initializeDatabase();
    if (success) {
        console.log('\n✨ Database Neon sudah terverifikasi dan siap digunakan!');
        process.exit(0);
    } else {
        console.log('\n❌ Gagal verifikasi database. Periksa DATABASE_URL di .env');
        process.exit(1);
    }
}

verify();
