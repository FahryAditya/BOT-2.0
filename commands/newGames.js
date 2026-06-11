const db = require('../utils/jsonDB');
const quizManager = require('../quizManager');
const userStats = require('../utils/userStats');
const { animeEmojis, guessAnimeQuestions, animeFoods } = require('../absurdData');

const games = {
    shiritori: async (msg) => {
        const startWords = ['Naruto', 'One Piece', 'Bleach', 'Doraemon', 'Gintama', 'Zoro'];
        const startWord = startWords[Math.floor(Math.random() * startWords.length)];
        const lastChar = startWord.slice(-1).toUpperCase();
        
        const question = `🎮 *Anime Shiritori*\n\nKata mulai: *${startWord}*\n\nSebutkan nama karakter/anime yang berawalan dari huruf: *${lastChar}*!`;
        quizManager.createSession(msg.from, 'shiritori', question, lastChar, [`Harus berawalan huruf ${lastChar}`]);
        await msg.reply(question);
    },

    emojiriddles: async (msg) => {
        const riddles = [
            { emoji: '🏴‍☠️👒🍖', answer: 'One Piece' },
            { emoji: '🐱⚽⚡', answer: 'Inazuma Eleven' },
            { emoji: '📓✍️💀', answer: 'Death Note' },
            { emoji: '🗡️🧚⛓️', answer: 'Sword Art Online' },
            { emoji: '👹⚔️🌊', answer: 'Kimetsu no Yaiba' },
            { emoji: '🤖🎻🎹', answer: 'Shigatsu wa Kimi no Uso' }
        ];
        const riddle = riddles[Math.floor(Math.random() * riddles.length)];
        
        const question = `🧩 *Emoji Riddles*\n\nTebak judul anime dari emoji ini:\n${riddle.emoji}`;
        quizManager.createSession(msg.from, 'emojiriddles', question, riddle.answer, [`Huruf pertama: ${riddle.answer[0]}`]);
        await msg.reply(question);
    },

    scramble: async (msg) => {
        const names = ['NARUTO', 'SASUKE', 'LUFFY', 'GOKU', 'SAITAMA', 'MIKASA', 'LEVI', 'EREN', 'KILLUA', 'GON'];
        const name = names[Math.floor(Math.random() * names.length)];
        const scrambled = name.split('').sort(() => Math.random() - 0.5).join('-');
        
        const question = `🔀 *Scrambled Names*\n\nSusun nama karakter ini:\n*${scrambled}*`;
        quizManager.createSession(msg.from, 'scramble', question, name, [`Nama ini terdiri dari ${name.length} huruf`]);
        await msg.reply(question);
    },

    guessscene: async (msg) => {
        const scenes = [
            { desc: 'Seorang pemuda menemukan buku catatan yang bisa membunuh orang.', answer: 'Death Note' },
            { desc: 'Dua saudara mencoba menghidupkan kembali ibu mereka dengan alkimia.', answer: 'Fullmetal Alchemist' },
            { desc: 'Seorang pemain game terjebak di dalam dunia virtual game VRMMORPG.', answer: 'Sword Art Online' },
            { desc: 'Seorang detektif SMA berubah menjadi anak kecil setelah diracun.', answer: 'Detective Conan' }
        ];
        const scene = scenes[Math.floor(Math.random() * scenes.length)];
        
        const question = `🎬 *Guess Scene*\n\nTebak anime dari deskripsi adegan ini:\n\n"${scene.desc}"`;
        quizManager.createSession(msg.from, 'guessscene', question, scene.answer, [`Huruf pertama: ${scene.answer[0]}`]);
        await msg.reply(question);
    },

    hangman: async (msg) => {
        const animes = ['NARUTO', 'ONE PIECE', 'BLEACH', 'FAIRY TAIL', 'GINTAMA', 'DORAEMON'];
        const anime = animes[Math.floor(Math.random() * animes.length)];
        const hidden = anime.replace(/[A-Z]/g, (char) => Math.random() > 0.3 ? '_' : char);
        
        const question = `🪢 *Anime Hangman*\n\nTebak judul anime ini:\n\n*${hidden}*`;
        quizManager.createSession(msg.from, 'hangman', question, anime, [`Total ada ${anime.length} karakter (termasuk spasi)`]);
        await msg.reply(question);
    },

    waifucompat: async (msg, args) => {
        const target = args.join(' ') || 'Siapa saja';
        const score = Math.floor(Math.random() * 101);
        let comment = '';
        
        if (score > 80) comment = 'Wah, kalian jodoh banget! 💖';
        else if (score > 50) comment = 'Lumayan cocok lah. 👍';
        else if (score > 20) comment = 'Kurang nyambung kayaknya... 🙃';
        else comment = 'Mending cari yang lain bro. 💀';

        await msg.reply(`💕 *Waifu Compatibility*\n\nTingkat kecocokan kamu dengan *${target}* adalah:\n\n✨ *${score}%* ✨\n\n${comment}`);
    },
    
    tebakangka: async (msg) => {
        // Randomly decide range difficulty
        const difficulty = Math.random();
        let min, range;

        if (difficulty > 0.8) { // Hard: Hundreds
            min = Math.floor(Math.random() * 500) + 100;
            range = Math.floor(Math.random() * 100) + 20;
        } else if (difficulty > 0.4) { // Medium: Tens
            min = Math.floor(Math.random() * 90) + 10;
            range = Math.floor(Math.random() * 30) + 10;
        } else { // Easy: Units
            min = Math.floor(Math.random() * 10) + 1;
            range = Math.floor(Math.random() * 10) + 5;
        }

        const max = min + range;
        const target = Math.floor(Math.random() * (max - min + 1)) + min;
        
        const question = `🎲 *Tebak Angka*\n\nAku sudah memilih angka antara *${min}-${max}*. Coba tebak!`;
        quizManager.createSession(msg.from, 'tebakangka', question, target.toString(), [
            `Angkanya ada di antara ${min} dan ${max}`,
            `Digit terakhirnya adalah ${target.toString().slice(-1)}`
        ]);
        await msg.reply(question);
    },

    tebakgambar: async (msg) => {
        const randomEmoji = animeEmojis[Math.floor(Math.random() * animeEmojis.length)];
        const question = `🖼️ *Tebak Gambar (Emoji)*\n\n${randomEmoji.emoji}\n\nAnime apakah ini?`;
        quizManager.createSession(msg.from, 'tebakgambar', question, randomEmoji.anime, [`Huruf pertama: ${randomEmoji.anime[0]}`]);
        await msg.reply(question);
    },

    suwit: async (msg, args) => {
        const choice = args[0] ? args[0].toLowerCase() : null;
        if (!choice || !['gunting', 'batu', 'kertas'].includes(choice)) {
            return msg.reply('❌ Gunakan: !suwit [gunting/batu/kertas]');
        }
        
        const botChoices = ['gunting', 'batu', 'kertas'];
        const botChoice = botChoices[Math.floor(Math.random() * 3)];
        let result = '';
        let points = 0;

        if (choice === botChoice) {
            result = 'SERI! 🤝';
        } else if (
            (choice === 'batu' && botChoice === 'gunting') ||
            (choice === 'gunting' && botChoice === 'kertas') ||
            (choice === 'kertas' && botChoice === 'batu')
        ) {
            result = 'KAMU MENANG! 🏆';
            points = 50;
        } else {
            result = 'KAMU KALAH! 😜';
            points = -20;
        }

        const user = msg.author || msg.from;
        if (points > 0) await userStats.addPoints(user, points);
        else if (points < 0) await userStats.subPoints(user, Math.abs(points));

        await msg.reply(`✌️ *Suwit*\n\nKamu: ${choice}\nBot: ${botChoice}\n\nHasil: ${result}${points !== 0 ? `\nPoints: ${points > 0 ? '+' : ''}${points}` : ''}`);
    },

    dadu: async (msg) => {
        const roll = Math.floor(Math.random() * 6) + 1;
        await msg.reply(`🎲 *Kocok Dadu*\n\nHasil: ${roll}`);
    },

    flipcoin: async (msg) => {
        const result = Math.random() > 0.5 ? 'KEPALA' : 'EKOR';
        await msg.reply(`🪙 *Lempar Koin*\n\nHasil: ${result}`);
    },

    tebaktebakan: async (msg) => {
        const randomQ = guessAnimeQuestions[Math.floor(Math.random() * guessAnimeQuestions.length)];
        const question = `🤔 *Tebak-tebakan Anime*\n\n${randomQ.clue}`;
        quizManager.createSession(msg.from, 'tebaktebakan', question, randomQ.answer, randomQ.hints);
        await msg.reply(question);
    },

    slot: async (msg) => {
        const user = msg.author || msg.from;
        const stats = await userStats.getUser(user);
        if (!stats) return msg.reply('❌ Gagal memuat data profil. Coba lagi sebentar lagi.');
        
        if (stats.points < 20) return msg.reply('❌ Kamu butuh minimal 20 points untuk main slot!');
        
        await userStats.subPoints(user, 20);
        
        const emojis = ['🍎', '🍒', '🍇', '💎', '7️⃣'];
        const r1 = emojis[Math.floor(Math.random() * emojis.length)];
        const r2 = emojis[Math.floor(Math.random() * emojis.length)];
        const r3 = emojis[Math.floor(Math.random() * emojis.length)];
        
        let win = false;
        let prize = 0;

        if (r1 === r2 && r2 === r3) {
            win = true;
            prize = r1 === '7️⃣' ? 500 : r1 === '💎' ? 300 : 150;
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            prize = 30; // Small win
        }

        if (prize > 0) await userStats.addPoints(user, prize);

        let response = `🎰 *Slot Machine*\n\n[ ${r1} | ${r2} | ${r3} ]\n\n`;
        if (win) response += `JACKPOT! 🎉 Kamu dapat ${prize} points!`;
        else if (prize > 0) response += `Lumayan! Kamu dapat ${prize} points!`;
        else response += `Coba lagi! Points berkurang 20. 🙃`;

        await msg.reply(response);
    },

    tictactoe: async (msg, args) => {
        const user = msg.author || msg.from;
        const target = msg.mentionedIds && msg.mentionedIds[0];
        const chatId = msg.from;

        const sessions = db.get('ttt_sessions') || {};
        
        // Handle moves if session exists
        if (sessions[chatId]) {
            const session = sessions[chatId];
            const move = parseInt(args[0]);

            if (isNaN(move) || move < 1 || move > 9) {
                return msg.reply('❌ Masukkan angka 1-9 untuk melangkah! (!tictactoe <1-9>)');
            }

            const currentPlayer = session.turn === 'X' ? session.p1 : session.p2;
            if (user !== currentPlayer) return msg.reply('❌ Bukan giliranmu!');

            const idx = move - 1;
            if (session.board[idx] !== '-') return msg.reply('❌ Kotak sudah terisi!');

            session.board[idx] = session.turn;
            
            // Check win
            const winPatterns = [
                [0,1,2], [3,4,5], [6,7,8], // Rows
                [0,3,6], [1,4,7], [2,5,8], // Cols
                [0,4,8], [2,4,6]           // Diagonals
            ];

            let winner = null;
            for (const p of winPatterns) {
                if (session.board[p[0]] !== '-' && session.board[p[0]] === session.board[p[1]] && session.board[p[1]] === session.board[p[2]]) {
                    winner = session.turn;
                    break;
                }
            }

            const boardStr = `
${session.board[0]} | ${session.board[1]} | ${session.board[2]}
--+---+--
${session.board[3]} | ${session.board[4]} | ${session.board[5]}
--+---+--
${session.board[6]} | ${session.board[7]} | ${session.board[8]}
            `.trim();

            if (winner) {
                const winnerId = winner === 'X' ? session.p1 : session.p2;
                await userStats.addPoints(winnerId, 200);
                delete sessions[chatId];
                db.set('ttt_sessions', sessions);
                return msg.reply(`🎉 *TIC TAC TOE WINNER!* 🎉\n\n${boardStr}\n\n@${winnerId.split('@')[0]} MENANG! +200 pts.`, null, { mentions: [winnerId] });
            }

            if (!session.board.includes('-')) {
                delete sessions[chatId];
                db.set('ttt_sessions', sessions);
                return msg.reply(`🤝 *TIC TAC TOE DRAW!* 🤝\n\n${boardStr}\n\nPermainan berakhir seri.`);
            }

            session.turn = session.turn === 'X' ? 'O' : 'X';
            db.set('ttt_sessions', sessions);
            
            const nextPlayer = session.turn === 'X' ? session.p1 : session.p2;
            return msg.reply(`⭕ *TIC TAC TOE* ❌\n\n${boardStr}\n\nGiliran: @${nextPlayer.split('@')[0]} (${session.turn})`, null, { mentions: [nextPlayer] });
        }

        // Start new session
        if (!target) return msg.reply('❌ Tag lawanmu untuk mulai! (!tictactoe @user)');
        if (target === user) return msg.reply('❌ Tidak bisa main sendiri!');

        sessions[chatId] = {
            p1: user,
            p2: target,
            board: ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
            turn: 'X',
            timestamp: Date.now()
        };
        db.set('ttt_sessions', sessions);

        await msg.reply(`⭕ *TIC TAC TOE STARTED!* ❌\n\n@${user.split('@')[0]} (X) vs @${target.split('@')[0]} (O)\n\nKetik *!tictactoe <1-9>* untuk melangkah.\n\n1 | 2 | 3\n--+---+--\n4 | 5 | 6\n--+---+--\n7 | 8 | 9`, null, { mentions: [user, target] });
    },

    hitung: async (msg) => {
        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a, b, ans;
        
        if (op === '+') {
            a = Math.floor(Math.random() * 100);
            b = Math.floor(Math.random() * 100);
            ans = a + b;
        } else if (op === '-') {
            a = Math.floor(Math.random() * 100);
            b = Math.floor(Math.random() * Math.min(a, 100));
            ans = a - b;
        } else {
            a = Math.floor(Math.random() * 12);
            b = Math.floor(Math.random() * 12);
            ans = a * b;
        }

        const question = `🧮 *Kuis Matematika*\n\nBerapa *${a} ${op} ${b}*?\n\n(Waktu: 30 detik)`;
        quizManager.createSession(msg.from, 'hitung', question, ans.toString(), [`Hasilnya mendekati ${Math.round(ans/10)*10}`]);
        await msg.reply(question);
    },

    katabijak: async (msg) => {
        const quotes = [
            "Hiduplah seolah kamu mati besok. Belajarlah seolah kamu hidup selamanya.",
            "Jangan berhenti ketika lelah, berhentilah ketika selesai.",
            "Kesuksesan adalah kemampuan untuk pergi dari satu kegagalan ke kegagalan lain tanpa kehilangan antusiasme.",
            "Waktu kamu terbatas, jangan habiskan untuk menjalani hidup orang lain.",
            "Satu-satunya cara untuk melakukan pekerjaan besar adalah dengan mencintai apa yang kamu lakukan.",
            "Jangan tanyakan apa yang dunia butuhkan, tanyakan apa yang membuatmu hidup, lalu kerjakan.",
            "Masa depan adalah milik mereka yang percaya pada keindahan mimpi mereka."
        ];
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        await msg.reply(`📜 *Kata Bijak*\n\n"${quote}"`);
    }
};

module.exports = games;

