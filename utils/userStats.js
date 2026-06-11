const { pool } = require('./neonDB');

/**
 * userStats Utility - Neon PostgreSQL Version
 */
const userStats = {
    /**
     * Get user data or initialize if not exists
     */
    getUser: async (userId) => {
        try {
            const res = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
            
            if (res.rows.length === 0) {
                // Initialize new user in DB
                const newUser = {
                    user_id: userId,
                    points: 100,
                    bank: 0,
                    exp: 0,
                    level: 1,
                    hp: 100,
                    max_hp: 100,
                    bio: 'No bio set',
                    inventory: JSON.stringify([]),
                    pet: JSON.stringify({ name: 'None', level: 1, hunger: 100, health: 100, lastFed: 0 })
                };

                await pool.query(`
                    INSERT INTO users (user_id, points, bank, exp, level, hp, max_hp, bio, inventory, pet)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                `, [
                    newUser.user_id, newUser.points, newUser.bank, newUser.exp, 
                    newUser.level, newUser.hp, newUser.max_hp, newUser.bio,
                    newUser.inventory, newUser.pet
                ]);

                return {
                    ...newUser,
                    maxHp: newUser.max_hp,
                    lastDaily: 0,
                    lastWork: 0,
                    lastHeal: 0,
                    inventory: [],
                    pet: JSON.parse(newUser.pet)
                };
            }

            const row = res.rows[0];
            // Map DB columns to object properties for backward compatibility
            return {
                ...row,
                maxHp: row.max_hp,
                lastDaily: Number(row.last_daily),
                lastWork: Number(row.last_work),
                lastHeal: Number(row.last_heal),
                points: Number(row.points),
                bank: Number(row.bank),
                exp: Number(row.exp),
                inventory: typeof row.inventory === 'string' ? JSON.parse(row.inventory) : row.inventory,
                pet: typeof row.pet === 'string' ? JSON.parse(row.pet) : row.pet
            };
        } catch (error) {
            console.error('❌ Database Error (getUser):', error.message);
            return null;
        }
    },

    /**
     * Update user data
     */
    updateUser: async (userId, data) => {
        try {
            // Map camelCase to snake_case if necessary
            const updateFields = [];
            const values = [];
            let i = 1;

            const mapping = {
                points: 'points',
                bank: 'bank',
                exp: 'exp',
                level: 'level',
                hp: 'hp',
                maxHp: 'max_hp',
                lastDaily: 'last_daily',
                lastWork: 'last_work',
                lastHeal: 'last_heal',
                bio: 'bio',
                marry: 'marry',
                inventory: 'inventory',
                pet: 'pet'
            };

            for (const [key, value] of Object.entries(data)) {
                if (mapping[key]) {
                    updateFields.push(`${mapping[key]} = $${i}`);
                    if (key === 'inventory' || key === 'pet') {
                        values.push(JSON.stringify(value));
                    } else {
                        values.push(value);
                    }
                    i++;
                }
            }

            if (updateFields.length === 0) return;

            values.push(userId);
            await pool.query(`
                UPDATE users SET ${updateFields.join(', ')}, updated_at = NOW()
                WHERE user_id = $${i}
            `, values);
        } catch (error) {
            console.error('❌ Database Error (updateUser):', error.message);
        }
    },

    /**
     * Add points and EXP to user atomically
     */
    addPoints: async (userId, amount) => {
        try {
            const expGain = Math.floor(amount / 10);
            
            // Atomic update to points and exp
            const res = await pool.query(`
                UPDATE users 
                SET points = points + $1, 
                    exp = exp + $2,
                    updated_at = NOW()
                WHERE user_id = $3
                RETURNING *
            `, [amount, expGain, userId]);

            if (res.rows.length === 0) return null;
            
            let user = res.rows[0];
            user.maxHp = user.max_hp; // Mapping for compatibility

            // Leveling logic
            let currentLevel = user.level;
            let currentExp = Number(user.exp);
            let nextLevelExp = currentLevel * 100;
            let leveledUp = false;

            while (currentExp >= nextLevelExp) {
                currentLevel += 1;
                currentExp -= nextLevelExp;
                nextLevelExp = currentLevel * 100;
                leveledUp = true;
            }

            if (leveledUp) {
                const updatedRes = await pool.query(`
                    UPDATE users 
                    SET level = $1, 
                        exp = $2, 
                        max_hp = max_hp + $3,
                        hp = max_hp + $3
                    WHERE user_id = $4
                    RETURNING *
                `, [currentLevel, currentExp, (currentLevel - user.level) * 10, userId]);
                user = updatedRes.rows[0];
                user.maxHp = user.max_hp;
            }

            return {
                ...user,
                points: Number(user.points),
                bank: Number(user.bank),
                exp: Number(user.exp),
                inventory: typeof user.inventory === 'string' ? JSON.parse(user.inventory) : user.inventory,
                pet: typeof user.pet === 'string' ? JSON.parse(user.pet) : user.pet
            };
        } catch (error) {
            console.error('❌ Database Error (addPoints):', error.message);
            return null;
        }
    },

    /**
     * Subtract points from user atomically
     */
    subPoints: async (userId, amount) => {
        try {
            const res = await pool.query(`
                UPDATE users 
                SET points = GREATEST(0, points - $1),
                    updated_at = NOW()
                WHERE user_id = $2
                RETURNING *
            `, [amount, userId]);

            if (res.rows.length === 0) return null;
            
            const user = res.rows[0];
            return {
                ...user,
                maxHp: user.max_hp,
                points: Number(user.points),
                bank: Number(user.bank),
                exp: Number(user.exp),
                inventory: typeof user.inventory === 'string' ? JSON.parse(user.inventory) : user.inventory,
                pet: typeof user.pet === 'string' ? JSON.parse(user.pet) : user.pet
            };
        } catch (error) {
            console.error('❌ Database Error (subPoints):', error.message);
            return null;
        }
    },

    /**
     * Get global leaderboard
     */
    getGlobalLeaderboard: async () => {
        try {
            const res = await pool.query(`
                SELECT user_id as id, points, bank, level 
                FROM users 
                ORDER BY (points + bank) DESC 
                LIMIT 10
            `);
            return res.rows.map(row => ({
                ...row,
                points: Number(row.points),
                bank: Number(row.bank)
            }));
        } catch (error) {
            console.error('❌ Database Error (getGlobalLeaderboard):', error.message);
            return [];
        }
    }
};

module.exports = userStats;
