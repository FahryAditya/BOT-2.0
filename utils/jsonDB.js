const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../session/db.json');

function readDB() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({}));
        return {};
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
    get: (key) => readDB()[key] || {},
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
