// ===== أنمي دنجو - Database =====
const animeDB = [
    {
        id: "mortal-journey",
        title: "A Record of Mortal's Journey to Immortality",
        titleAr: "سجل رحلة البشرية نحو الخلود",
        image: "🧘",
        status: "مستمر",
        rating: "9.7",
        type: "ONA",
        duration: "20 دقيقة",
        network: "BiliBili",
        description: "قصة فتى عادي يسعى لتحقيق الخلود من خلال التدريب والممارسة الروحانية في عالم مليء بالمخاطر والفرص.",
        seasons: [
            {
                seasonNum: 5,
                seasonTitle: "الموسم الخامس",
                episodes: [
                    {
                        epNum: 177,
                        epTitle: "الحلقة 1",
                        players: [
                            { name: "Dailymotion", url: "https://www.dailymotion.com/embed/video/xxxxx1" },
                            { name: "سيرفر 2", url: "https://www.dailymotion.com/embed/video/xxxxx1b" }
                        ],
                        download: "https://ouo.io/xxxxx1"
                    },
                    {
                        epNum: 178,
                        epTitle: "الحلقة 2",
                        players: [
                            { name: "Dailymotion", url: "https://www.dailymotion.com/embed/video/xxxxx2" },
                            { name: "سيرفر 2", url: "https://www.dailymotion.com/embed/video/xxxxx2b" }
                        ],
                        download: "https://ouo.io/xxxxx2"
                    },
                    {
                        epNum: 179,
                        epTitle: "الحلقة 3",
                        players: [
                            { name: "Dailymotion", url: "https://www.dailymotion.com/embed/video/xxxxx3" },
                            { name: "سيرفر 2", url: "https://www.dailymotion.com/embed/video/xxxxx3b" }
                        ],
                        download: "https://ouo.io/xxxxx3"
                    },
                    {
                        epNum: 180,
                        epTitle: "الحلقة 4",
                        players: [
                            { name: "Dailymotion", url: "https://www.dailymotion.com/embed/video/xxxxx4" },
                            { name: "سيرفر 2", url: "https://www.dailymotion.com/embed/video/xxxxx4b" }
                        ],
                        download: "https://ouo.io/xxxxx4"
                    }
                ]
            }
        ]
    },
    {
        id: "swallowed-star",
        title: "Swallowed Star",
        titleAr: "النجم المبتلع",
        image: "⭐",
        status: "مستمر",
        rating: "9.5",
        type: "ONA",
        duration: "18 دقيقة",
        network: "Tencent",
        description: "في عالم يعج بالوحوش، يصبح شاب عادي أقوى محارب لحماية البشرية.",
        seasons: [
            {
                seasonNum: 1,
                seasonTitle: "الموسم الأول",
                episodes: [
                    {
                        epNum: 1,
                        epTitle: "البداية",
                        players: [
                            { name: "Dailymotion", url: "https://www.dailymotion.com/embed/video/ssss1" }
                        ],
                        download: "https://ouo.io/ssss1"
                    },
                    {
                        epNum: 2,
                        epTitle: "القوة الأولى",
                        players: [
                            { name: "Dailymotion", url: "https://www.dailymotion.com/embed/video/ssss2" }
                        ],
                        download: "https://ouo.io/ssss2"
                    }
                ]
            }
        ]
    },
    {
        id: "battle-through-heavens",
        title: "Battle Through the Heavens",
        titleAr: "معركة السماوات",
        image: "🔥",
        status: "مستمر",
        rating: "9.3",
        type: "ONA",
        duration: "22 دقيقة",
        network: "Tencent",
        description: "فتى يعيد اكتشاف قوته ويسعى للانتقام في عالم الزراعة الروحية.",
        seasons: [
            {
                seasonNum: 1,
                seasonTitle: "الموسم الأول",
                episodes: [
                    {
                        epNum: 1,
                        epTitle: "العودة",
                        players: [
                            { name: "Dailymotion", url: "https://www.dailymotion.com/embed/video/bth1" }
                        ],
                        download: "https://ouo.io/bth1"
                    }
                ]
            }
        ]
    }
];

function getAnimeById(id) { return animeDB.find(a => a.id === id); }

function getEpisode(animeId, seasonNum, epNum) {
    const anime = getAnimeById(animeId);
    if (!anime) return null;
    const season = anime.seasons.find(s => s.seasonNum === seasonNum);
    if (!season) return null;
    return season.episodes.find(e => e.epNum === epNum);
}

// ===== Load from localStorage =====
function loadFromStorage() {
    const stored = localStorage.getItem('donghuaDB');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            animeDB.length = 0;
            data.forEach(item => animeDB.push(item));
        } catch (e) { console.log('No stored data'); }
    }
}

if (typeof localStorage !== 'undefined') loadFromStorage();
