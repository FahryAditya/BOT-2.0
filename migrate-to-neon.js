const fs = require('fs');
const path = require('path');
const { pool } = require('./utils/neonDB');

const DB_PATH = path.join(__dirname, './session/db.json');

async function migrate() {
    if (!fs.existsSync(DB_PATH)) {
        console.log('❌ File jsonDB tidak ditemukan di ./session/db.json');
        return;
    }

    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const users = data.users || {};
    const userIds = Object.keys(users);

    console.log(`🚀 Memulai migrasi ${userIds.length} user ke Neon...`);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        for (const userId of userIds) {
            const u = users[userId];
            await client.query(`
                INSERT INTO users (
                    user_id, points, bank, exp, level, hp, max_hp, 
                    last_daily, last_work, last_heal, inventory, pet, marry, bio
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                ON CONFLICT (user_id) DO UPDATE SET
                    points = EXCLUDED.points,
                    bank = EXCLUDED.bank,
                    exp = EXCLUDED.exp,
                    level = EXCLUDED.level,
                    hp = EXCLUDED.hp,
                    max_hp = EXCLUDED.max_hp,
                    last_daily = EXCLUDED.last_daily,
                    last_work = EXCLUDED.last_work,
                    last_heal = EXCLUDED.last_heal,
                    inventory = EXCLUDED.inventory,
                    pet = EXCLUDED.pet,
                    marry = EXCLUDED.marry,
                    bio = EXCLUDED.bio,
                    updated_at = NOW()
            `, [
                userId, u.points, u.bank, u.exp, u.level, u.hp, u.maxHp,
                u.lastDaily, u.lastWork, u.lastHeal, 
                JSON.stringify(u.inventory || []), 
                JSON.stringify(u.pet || {}), 
                u.marry, u.bio
            ]);
        }

        await client.query('COMMIT');
        console.log('✅ Migrasi selesai dengan sukses!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Gagal migrasi:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
