const db = require('../utils/jsonDB');
const userStats = require('../utils/userStats');

const specialFeatures2 = {
    rank: async (msg) => {
        const user = msg.author || msg.from;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        const lb = await userStats.getGlobalLeaderboard();
        const rank = lb.findIndex(u => u.id === user) + 1;
        
        const rankMsg = `
📊 *USER PROFILE & RANK* 📊

👤 *User:* @${user.split('@')[0]}
🎖️ *Rank:* ${rank > 0 ? `#${rank}` : 'Unranked'}
⭐ *Level:* ${stats.level}
✨ *EXP:* ${stats.exp} / ${stats.level * 100}
💰 *Points:* ${stats.points}
🏦 *Bank:* ${stats.bank}
❤️ *HP:* ${stats.hp} / ${stats.maxHp}
📝 *Bio:* ${stats.bio}

👫 *Spouse:* ${stats.marry ? `@${stats.marry.split('@')[0]}` : 'Single'}
🐾 *Pet:* ${stats.pet.name !== 'None' ? `${stats.pet.name} (Lv. ${stats.pet.level})` : 'No pet'}
        `.trim();
        
        await msg.reply(rankMsg, null, { mentions: [user, stats.marry].filter(Boolean) });
    },

    inventory: async (msg) => {
        const user = msg.author || msg.from;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        
        if (stats.inventory.length === 0) {
            return msg.reply('🎒 *Inventory kamu kosong!* Beli sesuatu di !shop.');
        }
        
        const inv = stats.inventory.map((item, i) => `${i + 1}. ${item}`).join('\n');
        await msg.reply(`🎒 *INVENTORY KAMU* 🎒\n\n${inv}`);
    },

    daily: async (msg) => {
        const user = msg.author || msg.from;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        const now = Date.now();
        const cooldown = 24 * 60 * 60 * 1000; // 24 hours
        
        if (now - stats.lastDaily < cooldown) {
            const remaining = cooldown - (now - stats.lastDaily);
            const hours = Math.floor(remaining / (60 * 60 * 1000));
            const mins = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
            return msg.reply(`🎁 *Daily Reward*\n\nKamu sudah klaim hari ini. Tunggu ${hours}j ${mins}m lagi.`);
        }
        
        const reward = 500;
        await userStats.addPoints(user, reward);
        await userStats.updateUser(user, { lastDaily: now });
        
        await msg.reply(`🎁 *Daily Reward*\n\nSelamat! Kamu mendapatkan *${reward} points*!`);
    },

    steal: async (msg, args) => {
        const user = msg.author || msg.from;
        const target = msg.mentionedIds && msg.mentionedIds[0];
        
        if (!target) return msg.reply('❌ Tag user yang ingin dicuri poinnya! (!steal @user)');
        if (target === user) return msg.reply('❌ Mana bisa nyuri dari diri sendiri...');
        
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        const targetStats = await userStats.getUser(target);
        
        if (targetStats.points < 100) return msg.reply('❌ Target terlalu miskin untuk dicuri.');
        
        const success = Math.random() > 0.6; // 40% success rate
        if (success) {
            const amount = Math.floor(Math.random() * 100) + 50;
            await userStats.addPoints(user, amount);
            await userStats.subPoints(target, amount);
            await msg.reply(`🥷 *STEAL SUCCESS!*\n\nKamu berhasil mencuri *${amount} points* dari @${target.split('@')[0]}!`, null, { mentions: [target] });
        } else {
            const fine = 100;
            await userStats.subPoints(user, fine);
            await msg.reply(`👮 *STEAL FAILED!*\n\nKamu ketahuan dan didenda *${fine} points*!`, null, { mentions: [target] });
        }
    },

    bank: async (msg) => {
        const user = msg.author || msg.from;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        await msg.reply(`🏦 *BANK SENTRAL* 🏦\n\n💰 *Cash:* ${stats.points}\n💳 *Bank:* ${stats.bank}\n\n*Commands:* \n!deposit <jumlah>\n!withdraw <jumlah>`);
    },

    marry: async (msg, args) => {
        const user = msg.author || msg.from;
        const target = msg.mentionedIds && msg.mentionedIds[0];
        
        if (!target) return msg.reply('❌ Tag orang yang ingin kamu lamar! (!marry @user)');
        if (target === user) return msg.reply('❌ Kamu tidak bisa menikahi diri sendiri!');
        
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        const targetStats = await userStats.getUser(target);
        
        if (stats.marry) return msg.reply('❌ Kamu sudah menikah! Cerai dulu dengan !divorce.');
        if (targetStats.marry) return msg.reply(`❌ @${target.split('@')[0]} sudah menikah dengan orang lain!`, null, { mentions: [target] });
        
        // In a real bot, we'd wait for acceptance. For now, let's just make it instant if tagged.
        await userStats.updateUser(user, { marry: target });
        await userStats.updateUser(target, { marry: user });
        
        // Add to marrylist
        let marrylist = db.get('marrylist');
        if (!Array.isArray(marrylist)) marrylist = [];
        marrylist.push({ u1: user, u2: target, date: Date.now() });
        db.set('marrylist', marrylist);
        
        await msg.reply(`💍 *HAPPY WEDDING!* 💍\n\nSelamat! @${user.split('@')[0]} dan @${target.split('@')[0]} sekarang resmi menikah! ❤️`, null, { mentions: [user, target] });
    },

    divorce: async (msg) => {
        const divorceEnabled = db.get('divorceEnabled') !== false; // Default to true
        if (!divorceEnabled) {
            return msg.reply('❌ Maaf, fitur !divorce sedang dinonaktifkan oleh admin.');
        }

        const user = msg.author || msg.from;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');

        if (!stats.marry) return msg.reply('❌ Kamu kan masih jomblo...');

        const target = stats.marry;
        await userStats.updateUser(user, { marry: null });
        await userStats.updateUser(target, { marry: null });

        // Remove from marrylist
        let marrylist = db.get('marrylist') || [];
        marrylist = marrylist.filter(m => m.u1 !== user && m.u2 !== user);
        db.set('marrylist', marrylist);

        await msg.reply(`💔 *BROKEN HEART*\n\n@${user.split('@')[0]} dan @${target.split('@')[0]} resmi bercerai. 😢`, null, { mentions: [user, target] });
    },

    nondivorce: async (msg) => {
        const user = msg.author || msg.from;
        const targetNumber = '6281550177145';
        
        console.log(`[DEBUG] nondivorce called by: ${user}`);
        console.log(`[DEBUG] Includes targetNumber? ${user.includes(targetNumber)}`);

        if (!user.includes(targetNumber)) {
            return; 
        }

        db.set('divorceEnabled', false);
        await msg.reply('✅ Fitur !divorce telah dinonaktifkan.');
    },

    activedivorce: async (msg) => {
        const user = msg.author || msg.from;
        const targetNumber = '6281550177145';
        
        console.log(`[DEBUG] activedivorce called by: ${user}`);
        console.log(`[DEBUG] Includes targetNumber? ${user.includes(targetNumber)}`);

        if (!user.includes(targetNumber)) {
            return;
        }

        db.set('divorceEnabled', true);
        await msg.reply('✅ Fitur !divorce telah diaktifkan kembali.');
    },

    pet: async (msg) => {
        const user = msg.author || msg.from;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        
        if (stats.pet.name === 'None') {
            return msg.reply('🐾 *Kamu belum punya pet!* Beli di !shop.');
        }
        
        const petMsg = `
🐾 *PET STATUS* 🐾

📛 *Nama:* ${stats.pet.name}
🎖️ *Level:* ${stats.pet.level}
🍖 *Hunger:* ${stats.pet.hunger}/100
❤️ *Health:* ${stats.pet.health}/100

_Gunakan !feed untuk memberi makan pet kamu!_
        `.trim();
        await msg.reply(petMsg);
    },

    feed: async (msg, args) => {
        const user = msg.author || msg.from;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        
        if (stats.pet.name === 'None') return msg.reply('❌ Kamu belum punya pet!');
        if (stats.pet.hunger >= 100) return msg.reply('❌ Pet kamu sudah kenyang!');
        
        const foodCost = 50;
        if (stats.points < foodCost) return msg.reply(`❌ Kamu butuh ${foodCost} points untuk beli makanan pet.`);
        
        await userStats.subPoints(user, foodCost);
        const newPet = { ...stats.pet, hunger: Math.min(100, stats.pet.hunger + 20), lastFed: Date.now() };
        await userStats.updateUser(user, { pet: newPet });
        
        await msg.reply(`🍖 *Pet Fed!*\n\n${stats.pet.name} makan dengan lahap! Hunger +20.`);
    },

    work: async (msg) => {
        const user = msg.author || msg.from;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        const now = Date.now();
        const cooldown = 60 * 60 * 1000; // 1 hour
        
        if (now - stats.lastWork < cooldown) {
            const remaining = cooldown - (now - stats.lastWork);
            const mins = Math.floor(remaining / (60 * 1000));
            return msg.reply(`💼 *Work*\n\nKamu masih lelah. Istirahat dulu ${mins} menit lagi.`);
        }
        
        const jobs = ['Karyawan Toko', 'Ojek Online', 'Developer Bot', 'Admin Grup', 'Penjual Gorengan'];
        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const salary = Math.floor(Math.random() * 300) + 200;
        
        await userStats.addPoints(user, salary);
        await userStats.updateUser(user, { lastWork: now });
        
        await msg.reply(`💼 *Work*\n\nKamu bekerja sebagai *${job}* dan mendapatkan gaji *${salary} points*!`);
    },

    shop: async (msg) => {
        const shopMsg = `
🛒 *BOT SHOP* 🛒

1. 🐾 *Starter Pet* - 2000 pts
   _Dapatkan pet virtual pertamamu!_
2. 💊 *Health Potion* - 500 pts
   _Pulihkan 50 HP._
3. 💍 *Diamond Ring* - 5000 pts
   _Item prestise untuk koleksi._
4. ⚔️ *Wooden Sword* - 1000 pts
   _Tingkatkan kekuatan duel._

*Cara beli:* !buy <nomor/nama>
        `.trim();
        await msg.reply(shopMsg);
    },

    duel: async (msg, args) => {
        const user = msg.author || msg.from;
        const target = msg.mentionedIds && msg.mentionedIds[0];
        
        if (!target) return msg.reply('❌ Tag lawan duelmu! (!duel @user)');
        if (target === user) return msg.reply('❌ Duel sama bayangan?');
        
        const bet = parseInt(args[1]) || 50;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        const targetStats = await userStats.getUser(target);
        
        if (stats.points < bet || targetStats.points < bet) {
            return msg.reply(`❌ Salah satu dari kalian tidak punya cukup points untuk taruhan (${bet} pts).`);
        }
        
        const win = Math.random() > 0.5;
        const winner = win ? user : target;
        const loser = win ? target : user;
        
        await userStats.addPoints(winner, bet);
        await userStats.subPoints(loser, bet);
        
        await msg.reply(`⚔️ *DUEL RESULTS* ⚔️\n\n@${winner.split('@')[0]} MENANG TELAK! 🏆\n@${loser.split('@')[0]} KO! 💀\n\nWinner mendapat *${bet} points*!`, null, { mentions: [winner, loser] });
    },

    give: async (msg, args) => {
        const user = msg.author || msg.from;
        const target = msg.mentionedIds && msg.mentionedIds[0];
        
        if (!target) return msg.reply('❌ Tag orang yang ingin diberi points! (!give @user <jumlah>)');
        
        const amount = parseInt(args.find(a => !isNaN(a) && !a.includes('@'))) || 0;
        if (amount <= 0) return msg.reply('❌ Jumlah points harus lebih dari 0!');
        
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        if (stats.points < amount) return msg.reply('❌ Points kamu tidak cukup!');
        
        await userStats.subPoints(user, amount);
        await userStats.addPoints(target, amount);
        
        await msg.reply(`💸 *TRANSFER SUCCESS*\n\nBerhasil mengirim *${amount} points* ke @${target.split('@')[0]}!`, null, { mentions: [target] });
    },

    git: async (msg, args) => {
        const user = msg.author || msg.from;
        const isTagAll = args.includes('!tagall');
        const target = msg.mentionedIds && msg.mentionedIds[0];
        
        const amount = parseInt(args.find(a => !isNaN(a) && !a.includes('@') && a !== '!tagall')) || 0;
        if (amount <= 0) return msg.reply('❌ Masukkan jumlah points yang valid! (!git <jumlah> @user atau !tagall)');

        const senderStats = await userStats.getUser(user);

        if (isTagAll) {
            const chat = await msg.getChat();
            if (!chat.isGroup) return msg.reply('❌ !tagall hanya bisa digunakan di grup!');
            
            const participants = chat.participants;
            const totalRequired = amount * (participants.length - 1); // Excluding sender

            if (senderStats.points < totalRequired) {
                return msg.reply(`❌ Points kamu tidak cukup! Butuh ${totalRequired} pts untuk memberi semua orang ${amount} pts.`);
            }

            await userStats.subPoints(user, totalRequired);
            const mentions = [];
            for (const participant of participants) {
                const targetId = participant.id._serialized;
                if (targetId === user) continue;
                await userStats.addPoints(targetId, amount);
                mentions.push(targetId);
            }

            await msg.reply(`🎁 *GIFT ALL SUCCESS!*\n\n@${user.split('@')[0]} memberikan *${amount} points* kepada SEMUA MEMBER! 🎊\nTotal dibagikan: ${totalRequired} pts.`, null, { mentions });
        } else {
            if (!target) return msg.reply('❌ Tag target atau gunakan !tagall! (!git <jumlah> @user)');
            
            if (senderStats.points < amount) return msg.reply('❌ Points kamu tidak cukup!');
            
            await userStats.subPoints(user, amount);
            await userStats.addPoints(target, amount);
            
            await msg.reply(`🎁 *GIFT SUCCESS*\n\nBerhasil mengirim *${amount} points* ke @${target.split('@')[0]}!`, null, { mentions: [target] });
        }
    },

    leaderboardglobal: async (msg) => {
        const lb = await userStats.getGlobalLeaderboard();
        let lbMsg = `🏆 *GLOBAL LEADERBOARD* 🏆\n\n`;
        
        lb.forEach((user, i) => {
            lbMsg += `${i + 1}. @${user.id.split('@')[0]} - ${user.points + user.bank} pts\n`;
        });
        
        await msg.reply(lbMsg, null, { mentions: lb.map(u => u.id) });
    },

    wish: async (msg) => {
        const user = msg.author || msg.from;
        const cost = 100;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        
        if (stats.points < cost) return msg.reply('❌ Kamu butuh 100 points untuk 1x wish!');
        
        await userStats.subPoints(user, cost);
        
        const rand = Math.random();
        let result = '';
        if (rand > 0.95) {
            await userStats.addPoints(user, 1000);
            result = '🌟 *SUPER RARE!* Kamu dapat 1000 points!';
        } else if (rand > 0.8) {
            await userStats.addPoints(user, 300);
            result = '✨ *RARE!* Kamu dapat 300 points!';
        } else if (rand > 0.5) {
            await userStats.addPoints(user, 150);
            result = '✅ *COMMON.* Kamu dapat 150 points!';
        } else {
            result = '💩 *ZONK.* Kamu cuma dapat doa restu dari bot.';
        }
        
        await msg.reply(`✨ *WISH SYSTEM* ✨\n\n${result}`);
    },

    setbio: async (msg, args) => {
        const user = msg.author || msg.from;
        const bio = args.join(' ');
        if (!bio) return msg.reply('❌ Masukkan teks bio! (!setbio Halo dunia)');
        if (bio.length > 50) return msg.reply('❌ Bio maksimal 50 karakter!');
        
        await userStats.updateUser(user, { bio: bio });
        await msg.reply('✅ *Bio berhasil diupdate!*');
    },

    marrylist: async (msg) => {
        const marrylist = db.get('marrylist') || [];
        if (marrylist.length === 0) return msg.reply('👫 *Belum ada yang menikah di bot ini.* Kasihan ya...');
        
        let listMsg = `💍 *DAFTAR PERNIKAHAN* 💍\n\n`;
        const mentions = [];
        marrylist.slice(0, 10).forEach((m, i) => {
            listMsg += `${i + 1}. @${m.u1.split('@')[0]} ❤️ @${m.u2.split('@')[0]}\n`;
            mentions.push(m.u1, m.u2);
        });
        
        await msg.reply(listMsg, null, { mentions });
    },

    heal: async (msg) => {
        const user = msg.author || msg.from;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        const now = Date.now();
        const cooldown = 10 * 60 * 1000; // 10 mins
        
        if (stats.hp >= stats.maxHp) return msg.reply('❤️ *HP kamu sudah penuh!*');
        
        if (now - stats.lastHeal < cooldown) {
            const remaining = Math.floor((cooldown - (now - stats.lastHeal)) / 1000);
            return msg.reply(`🩹 *Heal*\n\nTunggu ${remaining} detik lagi untuk heal.`);
        }
        
        await userStats.updateUser(user, { hp: stats.maxHp, lastHeal: now });
        await msg.reply('❤️ *HEAL SUCCESS!*\n\nHP kamu sekarang penuh kembali.');
    },

    upgrade: async (msg, args) => {
        const user = msg.author || msg.from;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        const itemName = args.join(' ').toLowerCase();
        
        if (!itemName) return msg.reply('❌ Masukkan nama item yang ingin diupgrade! (!upgrade wooden sword)');
        
        const itemIndex = stats.inventory.findIndex(item => item.toLowerCase().includes(itemName));
        if (itemIndex === -1) return msg.reply(`❌ Kamu tidak memiliki ${itemName} di inventory.`);
        
        const item = stats.inventory[itemIndex];
        let upgradeCost = 0;
        let newItem = '';

        if (item === 'Wooden Sword') {
            upgradeCost = 2000;
            newItem = 'Iron Sword';
        } else if (item === 'Iron Sword') {
            upgradeCost = 5000;
            newItem = 'Katana';
        } else if (item === 'Katana') {
            upgradeCost = 15000;
            newItem = 'Muramasa';
        } else {
            return msg.reply('❌ Item ini tidak bisa diupgrade lagi!');
        }

        if (stats.points < upgradeCost) return msg.reply(`❌ Points tidak cukup! Butuh ${upgradeCost} pts.`);
        
        await userStats.subPoints(user, upgradeCost);
        stats.inventory[itemIndex] = newItem;
        await userStats.updateUser(user, { inventory: stats.inventory });
        
        await msg.reply(`⬆️ *UPGRADE SUCCESS!*\n\n${item} ➡ *${newItem}*\nBiaya: ${upgradeCost} points.`);
    },

    setpetname: async (msg, args) => {
        const user = msg.author || msg.from;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        
        if (stats.pet.name === 'None') return msg.reply('❌ Kamu belum punya pet!');
        
        const newName = args.join(' ').trim();
        if (!newName) return msg.reply('❌ Masukkan nama baru untuk pet kamu! (!setpetname Kyuubi)');
        if (newName.length > 15) return msg.reply('❌ Nama pet maksimal 15 karakter!');
        
        const oldName = stats.pet.name;
        const newPet = { ...stats.pet, name: newName };
        await userStats.updateUser(user, { pet: newPet });
        
        await msg.reply(`🎉 *Name Changed!*\n\n${oldName} sekarang resmi bernama *${newName}*!`);
    },

    event: async (msg) => {
        await msg.reply('📅 *CURRENT EVENTS* 📅\n\n1. *Double Points Weekend!* (Coming soon)\n2. *Quiz Marathon!* (Coming soon)\n\nStay tuned!');
    },

    deposit: async (msg, args) => {
        const user = msg.author || msg.from;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');

        const amount = args[0] === 'all' ? stats.points : parseInt(args[0]);
        
        if (!amount || amount <= 0) return msg.reply('❌ Masukkan jumlah yang valid! (!deposit 100 atau !deposit all)');
        
        if (stats.points < amount) return msg.reply('❌ Points kamu tidak cukup!');
        
        await userStats.updateUser(user, { 
            points: stats.points - amount,
            bank: stats.bank + amount
        });
        
        await msg.reply(`🏦 *Deposit Success!*\n\nBerhasil menyimpan *${amount} points* ke bank.`);
    },

    withdraw: async (msg, args) => {
        const user = msg.author || msg.from;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');

        const amount = args[0] === 'all' ? stats.bank : parseInt(args[0]);
        
        if (!amount || amount <= 0) return msg.reply('❌ Masukkan jumlah yang valid! (!withdraw 100 atau !withdraw all)');
        
        if (stats.bank < amount) return msg.reply('❌ Saldo bank kamu tidak cukup!');
        
        await userStats.updateUser(user, { 
            points: stats.points + amount,
            bank: stats.bank - amount
        });
        
        await msg.reply(`🏦 *Withdraw Success!*\n\nBerhasil menarik *${amount} points* dari bank.`);
    },

    buy: async (msg, args) => {
        const user = msg.author || msg.from;
        const itemQuery = args.join(' ').toLowerCase();
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        
        let item = null;
        let price = 0;

        if (itemQuery.includes('pet') || itemQuery === '1') {
            item = 'Starter Pet';
            price = 2000;
        } else if (itemQuery.includes('potion') || itemQuery === '2') {
            item = 'Health Potion';
            price = 500;
        } else if (itemQuery.includes('ring') || itemQuery === '3') {
            item = 'Diamond Ring';
            price = 5000;
        } else if (itemQuery.includes('sword') || itemQuery === '4') {
            item = 'Wooden Sword';
            price = 1000;
        }

        if (!item) return msg.reply('❌ Item tidak ditemukan! Gunakan !shop untuk melihat daftar.');
        if (stats.points < price) return msg.reply(`❌ Points kamu tidak cukup (Butuh ${price} pts).`);
        
        if (item === 'Starter Pet' && stats.pet.name !== 'None') {
            return msg.reply('❌ Kamu sudah punya pet!');
        }

        await userStats.subPoints(user, price);
        
        if (item === 'Starter Pet') {
            await userStats.updateUser(user, { pet: { name: 'Pochi', level: 1, hunger: 100, health: 100, lastFed: Date.now() } });
            await msg.reply('🎉 *Selamat!* Kamu baru saja membeli pet pertamamu! Beri dia nama dengan !setpetname (coming soon).');
        } else {
            const newInv = [...stats.inventory, item];
            await userStats.updateUser(user, { inventory: newInv });
            await msg.reply(`🛒 *Purchase Success!*\n\nBerhasil membeli *${item}* seharga ${price} points.`);
        }
    }
};

module.exports = specialFeatures2;

