const absurdFacts = [
    "Tahukah kamu? Naruto sebenarnya alergi ramen, tapi dia tetap makan karena cinta sejati!",
    "Fakta: Pikachu bisa berbicara bahasa manusia, tapi dia lebih suka bilang 'Pika Pika' karena lebih keren",
    "Goku sebenarnya takut jarum suntik tapi berani melawan alien yang bisa menghancurkan planet",
    "Light Yagami pernah lupa nama sendiri karena terlalu fokus nulis di Death Note",
    "Saitama botak bukan karena latihan, tapi karena stress mikirin tagihan listrik AC nya",
    "Eren Yeager sebenarnya vegetarian tapi jadi titan pemakan manusia, ironis kan?"
];

const weirdCharacters = [
    { name: "Buggy the Clown", quote: "Hidungku besar, tapi hatiku lebih besar... untuk harta karun!", anime: "One Piece" },
    { name: "Speedwagon", quote: "Aku cuma karakter support tapi popularitasku lebih tinggi dari protagonist!", anime: "JoJo" },
    { name: "Chopper", quote: "Aku dokter tapi sering dikira makanan darurat", anime: "One Piece" },
    { name: "Reigen", quote: "Aku bukan esper tapi bisa tipu semua orang jadi esper", anime: "Mob Psycho 100" },
    { name: "Mumen Rider", quote: "Aku hero paling lemah tapi punya mental paling kuat!", anime: "One Punch Man" }
];

const animeVsBattles = [
    "Saitama vs Sebutir Nasi - Pemenang: Nasi, karena Saitama males masak",
    "Goku vs Ujian Matematika - Pemenang: Matematika by TKO",
    "L Lawliet vs Tidur Normal - Pemenang: Insomnia strikes back",
    "Luffy vs All You Can Eat Buffet - Draw, keduanya saling mengalahkan",
    "Levi vs Debu - Pertarungan abadi yang tak akan pernah berakhir"
];

const animeGhostStories = [
    "Konon, di Studio Ghibli ada hantu yang mencuri semua makanan animasi. Hingga kini belum tertangkap karena makanannya terlalu enak.",
    "Di markas Survey Corps, sering terdengar suara 'Shinzou wo Sasageyo' tengah malam. Ternyata hanya Eren ngigau.",
    "Ada urban legend tentang Death Note yang hilang. Ternyata jatuh ke dunia nyata dan jadi buku catatan biasa.",
    "Hantu paling menakutkan di dunia anime? Deadline chapter manga yang tidak pernah terpenuhi."
];

const animeFoods = [
    { character: "Naruto", food: "Ramen isi wasabi pedas extra" },
    { character: "Luffy", food: "Daging dinosaurus goreng tepung" },
    { character: "Goku", food: "Senzu beans dengan topping rainbow" },
    { character: "Light Yagami", food: "Keripik kentang poisoned apple flavor" },
    { character: "Saitama", food: "Telur, pisang, dan eksistensial crisis" }
];

const animePets = [
    { character: "Itachi", pet: "Jadi kucing hitam yang masih bisa pake Sharingan" },
    { character: "Killua", pet: "Jadi hamster yang masih bisa pake listrik" },
    { character: "Deku", pet: "Jadi kelinci yang One For All nya cuma bisa lompat tinggi" },
    { character: "Gojo", pet: "Jadi kucing putih dengan blindfold, masih overpowered" },
    { character: "Tanjiro", pet: "Jadi anjing yang bisa cium bau emosi orang" }
];

const animeEmojis = [
    { anime: "One Piece", emoji: "🏴‍☠️🍖⛵" },
    { anime: "Naruto", emoji: "🍜🦊🍃" },
    { anime: "Attack on Titan", emoji: "🧱👹⚔️" },
    { anime: "My Hero Academia", emoji: "💪🦸‍♂️🏫" },
    { anime: "Death Note", emoji: "📓🍎☠️" },
    { anime: "Demon Slayer", emoji: "⚔️👹🌸" }
];

const guessAnimeQuestions = [
    { 
        clue: "Bocah kuning suka banget sama mie instan, tapi ayahnya malah jadi presiden. Masuk akal kan?",
        answer: "Naruto",
        hints: ["Ninja", "Kyuubi", "Konoha"]
    },
    { 
        clue: "Anak SMA yang hobinya nulis nama orang sambil makan keripik. Produktif sekali!",
        answer: "Death Note",
        hints: ["Shinigami", "L", "Notebook"]
    },
    { 
        clue: "Manusia karet yang pengen jadi raja, tapi gabisa berenang. Logic!",
        answer: "One Piece",
        hints: ["Bajak laut", "Topi jerami", "Grand Line"]
    }
];

module.exports = {
    absurdFacts,
    weirdCharacters,
    animeVsBattles,
    animeGhostStories,
    animeFoods,
    animePets,
    animeEmojis,
    guessAnimeQuestions
};