const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../session/db.json');

// In-memory cache
let dbCache = null;

function readDB() {
    if (dbCache) return dbCache;

    try {
        if (!fs.existsSync(DB_PATH)) {
            const dir = path.dirname(DB_PATH);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(DB_PATH, JSON.stringify({}));
            dbCache = {};
            return dbCache;
        }
        const content = fs.readFileSync(DB_PATH, 'utf8');
        dbCache = JSON.parse(content || '{}');
        return dbCache;
    } catch (error) {
        console.error('❌ Database Read Error:', error);
        dbCache = {};
        return dbCache;
    }
}

function writeDB(data) {
    try {
        dbCache = data;
        const tmpPath = `${DB_PATH}.tmp`;
        fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
        fs.renameSync(tmpPath, DB_PATH); // Atomic rename
    } catch (error) {
        console.error('❌ Database Write Error:', error);
    }
}

module.exports = {
    get: (key) => readDB()[key],
    set: (key, value) => {
        const db = readDB();
        db[key] = value;
        writeDB(db);
    },
    update: (key, updater) => {
        const db = readDB();
        db[key] = updater(db[key] || {});
        writeDB(db);
    }
};
