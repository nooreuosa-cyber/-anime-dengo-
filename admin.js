// ===== أنمي دنجو - Admin Dashboard =====

const DEFAULT_USER = 'admin';
const DEFAULT_PASS = 'admin123';

document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('adminLoggedIn') === 'true') showDashboard();
    loadDashboardStats();
    loadAnimeTable();
    loadEpisodesTable();
    loadRecentEpisodes();
    populateAnimeSelect();
});

function login() {
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    const errorEl = document.getElementById('loginError');
    const storedUser = localStorage.getItem('adminUsername') || DEFAULT_USER;
    const storedPass = localStorage.getItem('adminPassword') || DEFAULT_PASS;

    if (user === storedUser && pass === storedPass) {
        localStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
        errorEl.textContent = '';
    } else {
        errorEl.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة!';
        document.querySelector('.login-box').style.animation = 'shake 0.5s';
        setTimeout(() => { document.querySelector('.login-box').style.animation = ''; }, 500);
    }
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
    loadDashboardStats();
}

function logout() { localStorage.removeItem('adminLoggedIn'); location.reload(); }

function showSection(sectionName) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    document.getElementById('section-' + sectionName).classList.add('active');
    event.target.closest('a').classList.add('active');
    const titles = { 'dashboard': 'لوحة التحكم', 'anime': 'قائمة الأنمي', 'episodes': 'إدارة الحلقات', 'add': 'إضافة جديد', 'settings': 'الإعدادات' };
    document.getElementById('pageTitle').textContent = titles[sectionName] || 'لوحة التحكم';
    if (sectionName === 'dashboard') loadDashboardStats();
    if (sectionName === 'anime') loadAnimeTable();
    if (sectionName === 'episodes') loadEpisodesTable();
    if (sectionName === 'add') populateAnimeSelect();
}

function loadDashboardStats() {
    let totalAnime = animeDB.length;
    let totalEpisodes = 0, totalSeasons = 0, totalRating = 0;
    animeDB.forEach(anime => {
        totalRating += parseFloat(anime.rating) || 0;
        anime.seasons.forEach(season => { totalSeasons++; totalEpisodes += season.episodes.length; });
    });
    document.getElementById('totalAnime').textContent = totalAnime;
    document.getElementById('totalEpisodes').textContent = totalEpisodes;
    document.getElementById('totalSeasons').textContent = totalSeasons;
    document.getElementById('avgRating').textContent = totalAnime > 0 ? (totalRating / totalAnime).toFixed(1) : '0';
}

function loadRecentEpisodes() {
    const tbody = document.getElementById('recentEpisodesTable');
    let allEpisodes = [];
    animeDB.forEach(anime => {
        anime.seasons.forEach(season => {
            season.episodes.forEach(ep => {
                allEpisodes.push({ animeTitle: anime.titleAr, seasonNum: season.seasonNum, epNum: ep.epNum, epTitle: ep.epTitle, players: ep.players.length });
            });
        });
    });
    allEpisodes.sort((a, b) => b.epNum - a.epNum);
    allEpisodes = allEpisodes.slice(0, 10);
    let html = '';
    allEpisodes.forEach((ep, index) => {
        html += `<tr><td>${index + 1}</td><td>${ep.animeTitle}</td><td>${ep.epTitle}</td><td>الموسم ${ep.seasonNum}</td><td>${ep.players} مشغل</td></tr>`;
    });
    tbody.innerHTML = html;
}

function loadAnimeTable() {
    const tbody = document.getElementById('animeTable');
    let html = '';
    animeDB.forEach((anime, index) => {
        const totalEpisodes = anime.seasons.reduce((sum, s) => sum + s.episodes.length, 0);
        html += `
            <tr>
                <td>${anime.image}</td>
                <td><strong>${anime.titleAr}</strong><br><small style="color:var(--text-muted)">${anime.title}</small></td>
                <td><span class="badge ${anime.status === 'مستمر' ? 'badge-success' : 'badge-info'}">${anime.status}</span></td>
                <td>⭐ ${anime.rating}</td>
                <td>${totalEpisodes}</td>
                <td>
                    <button class="btn-edit" onclick="editAnime(${index})"><i class="fas fa-edit"></i></button>
                    <button class="btn-danger" onclick="deleteAnime(${index})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function loadEpisodesTable() {
    const tbody = document.getElementById('episodesTable');
    const filterAnime = document.getElementById('filterAnime').value;
    let html = ''; let rowNum = 1;
    animeDB.forEach(anime => {
        if (filterAnime && anime.id !== filterAnime) return;
        anime.seasons.forEach(season => {
            season.episodes.forEach(ep => {
                html += `<tr><td>${rowNum++}</td><td>${anime.titleAr}</td><td>${season.seasonNum}</td><td>${ep.epTitle}</td><td>${ep.players.length} مشغل</td><td><button class="btn-edit" onclick="editEpisode('${anime.id}', ${season.seasonNum}, ${ep.epNum})"><i class="fas fa-edit"></i></button><button class="btn-danger" onclick="deleteEpisode('${anime.id}', ${season.seasonNum}, ${ep.epNum})"><i class="fas fa-trash"></i></button></td></tr>`;
            });
        });
    });
    tbody.innerHTML = html || '<tr><td colspan="6" style="text-align:center; color:var(--text-muted)">لا توجد حلقات</td></tr>';
}

function filterEpisodes() { loadEpisodesTable(); }

function populateAnimeSelect() {
    const selects = ['episodeAnimeId', 'filterAnime'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;
        const firstOption = select.options[0];
        select.innerHTML = '';
        select.appendChild(firstOption);
        animeDB.forEach(anime => {
            const option = document.createElement('option');
            option.value = anime.id;
            option.textContent = anime.titleAr;
            select.appendChild(option);
        });
    });
}

function loadSeasonsForAnime() {
    const animeId = document.getElementById('episodeAnimeId').value;
    if (!animeId) return;
    const anime = getAnimeById(animeId);
    if (anime && anime.seasons.length > 0) document.getElementById('episodeSeasonNum').value = anime.seasons.length;
}

function addAnime() {
    const id = document.getElementById('newAnimeId').value.trim();
    const titleAr = document.getElementById('newAnimeTitleAr').value.trim();
    const title = document.getElementById('newAnimeTitle').value.trim();
    const image = document.getElementById('newAnimeImage').value || '🎬';
    const status = document.getElementById('newAnimeStatus').value;
    const rating = document.getElementById('newAnimeRating').value || '9.0';
    const type = document.getElementById('newAnimeType').value || 'ONA';
    const duration = document.getElementById('newAnimeDuration').value || '20 دقيقة';
    const network = document.getElementById('newAnimeNetwork').value || 'BiliBili';
    const desc = document.getElementById('newAnimeDesc').value.trim();

    if (!id || !titleAr) { alert('يرجى ملء الحقول المطلوبة!'); return; }
    if (animeDB.find(a => a.id === id)) { alert('هذا ID مستخدم بالفعل!'); return; }

    animeDB.push({ id, title: title || titleAr, titleAr, image, status, rating, type, duration, network, description: desc, seasons: [] });
    saveData();
    alert('تم إضافة المسلسل بنجاح!');
    clearAnimeForm();
    loadAnimeTable();
    populateAnimeSelect();
}

function clearAnimeForm() {
    document.getElementById('newAnimeId').value = '';
    document.getElementById('newAnimeTitleAr').value = '';
    document.getElementById('newAnimeTitle').value = '';
    document.getElementById('newAnimeDesc').value = '';
}

function addEpisode() {
    const animeId = document.getElementById('episodeAnimeId').value;
    const seasonNum = parseInt(document.getElementById('episodeSeasonNum').value);
    const epNum = parseInt(document.getElementById('episodeNum').value);
    const epTitle = document.getElementById('episodeTitle').value.trim() || `الحلقة ${epNum}`;
    const player1 = document.getElementById('player1Url').value.trim();
    const player2 = document.getElementById('player2Url').value.trim();
    const download = document.getElementById('episodeDownload').value.trim();

    if (!animeId || !player1) { alert('يرجى ملء الحقول المطلوبة!'); return; }
    const anime = getAnimeById(animeId);
    if (!anime) { alert('المسلسل غير موجود!'); return; }

    let season = anime.seasons.find(s => s.seasonNum === seasonNum);
    if (!season) {
        season = { seasonNum, seasonTitle: `الموسم ${seasonNum}`, episodes: [] };
        anime.seasons.push(season);
    }

    if (season.episodes.find(e => e.epNum === epNum)) {
        if (!confirm('هذه الحلقة موجودة بالفعل! هل تريد استبدالها؟')) return;
        season.episodes = season.episodes.filter(e => e.epNum !== epNum);
    }

    const players = [{ name: "Dailymotion", url: player1 }];
    if (player2) players.push({ name: "سيرفر 2", url: player2 });

    season.episodes.push({ epNum, epTitle, players, download: download || '#' });
    season.episodes.sort((a, b) => a.epNum - b.epNum);
    saveData();
    alert('تم إضافة الحلقة بنجاح!');
    clearEpisodeForm();
    loadEpisodesTable();
    loadRecentEpisodes();
    loadDashboardStats();
}

function clearEpisodeForm() {
    document.getElementById('episodeNum').value = parseInt(document.getElementById('episodeNum').value) + 1;
    document.getElementById('episodeTitle').value = '';
    document.getElementById('player1Url').value = '';
    document.getElementById('player2Url').value = '';
    document.getElementById('episodeDownload').value = '';
}

function deleteAnime(index) {
    if (!confirm('هل أنت متأكد من حذف هذا المسلسل وجميع حلقاته؟')) return;
    animeDB.splice(index, 1);
    saveData();
    loadAnimeTable();
    loadDashboardStats();
    populateAnimeSelect();
}

function deleteEpisode(animeId, seasonNum, epNum) {
    if (!confirm('هل أنت متأكد من حذف هذه الحلقة؟')) return;
    const anime = getAnimeById(animeId);
    if (!anime) return;
    const season = anime.seasons.find(s => s.seasonNum === seasonNum);
    if (!season) return;
    season.episodes = season.episodes.filter(e => e.epNum !== epNum);
    anime.seasons = anime.seasons.filter(s => s.episodes.length > 0);
    saveData();
    loadEpisodesTable();
    loadRecentEpisodes();
    loadDashboardStats();
}

function editAnime(index) { alert(`تعديل: ${animeDB[index].titleAr}\n\nفي النسخة الكاملة يمكن إضافة نافذة تعديل منبثقة.`); }
function editEpisode(animeId, seasonNum, epNum) { alert(`تعديل الحلقة ${epNum}\n\nفي النسخة الكاملة يمكن إضافة نافذة تعديل منبثقة.`); }

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('tab-' + tabName).classList.add('active');
}

function saveSettings() {
    const siteName = document.getElementById('siteName').value;
    const username = document.getElementById('settingsUsername').value;
    const password = document.getElementById('settingsPassword').value;
    if (siteName) localStorage.setItem('siteName', siteName);
    if (username) localStorage.setItem('adminUsername', username);
    if (password) localStorage.setItem('adminPassword', password);
    alert('تم حفظ الإعدادات بنجاح!');
}

function exportData() {
    const data = { animeDB: animeDB, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'anime-dengo-data-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importData(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.animeDB && Array.isArray(data.animeDB)) {
                if (confirm(`هل تريد استيراد ${data.animeDB.length} مسلسل؟ سيتم استبدال البيانات الحالية!`)) {
                    animeDB.length = 0;
                    data.animeDB.forEach(item => animeDB.push(item));
                    saveData();
                    location.reload();
                }
            } else { alert('ملف غير صالح!'); }
        } catch (err) { alert('خطأ في قراءة الملف!'); }
    };
    reader.readAsText(file);
}

function saveData() { localStorage.setItem('donghuaDB', JSON.stringify(animeDB)); }

const style = document.createElement('style');
style.textContent = `@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }`;
document.head.appendChild(style);
