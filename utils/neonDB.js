const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const initializeDatabase = async () => {
    const client = await pool.connect();
    try {
        console.log('🔄 Memulai inisialisasi database Neon...');
        
        // Create users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                points BIGINT DEFAULT 100,
                bank BIGINT DEFAULT 0,
                exp BIGINT DEFAULT 0,
                level INT DEFAULT 1,
                hp INT DEFAULT 100,
                max_hp INT DEFAULT 100,
                last_daily BIGINT DEFAULT 0,
                last_work BIGINT DEFAULT 0,
                last_heal BIGINT DEFAULT 0,
                inventory JSONB DEFAULT '[]',
                pet JSONB DEFAULT '{"name": "None", "level": 1, "hunger": 100, "health": 100, "lastFed": 0}',
                marry TEXT,
                bio TEXT DEFAULT 'No bio set',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        console.log('✅ Tabel "users" siap!');
        
        // Test connection
        const res = await client.query('SELECT NOW()');
        console.log('✅ Koneksi database berhasil! Jam server:', res.rows[0].now);
        
        return true;
    } catch (err) {
        console.error('❌ Error inisialisasi database:', err.message);
        return false;
    } finally {
        client.release();
    }
};

module.exports = {
    pool,
    initializeDatabase,
    query: (text, params) => pool.query(text, params)
};
