// ===== أنمي دنجو - Main Page Logic =====

document.addEventListener('DOMContentLoaded', function() {
    loadLatestEpisodes();
    loadAnimeList();
    updateHeroStats();
});

function updateHeroStats() {
    let totalEpisodes = 0;
    let totalAnime = animeDB.length;
    animeDB.forEach(a => {
        a.seasons.forEach(s => totalEpisodes += s.episodes.length);
    });
    document.getElementById('heroEpisodes').textContent = totalEpisodes + '+';
    document.getElementById('heroAnime').textContent = totalAnime + '+';
}

function loadLatestEpisodes() {
    const container = document.getElementById('latestEpisodes');
    let allEpisodes = [];
    animeDB.forEach(anime => {
        anime.seasons.forEach(season => {
            season.episodes.forEach(ep => {
                allEpisodes.push({
                    ...ep,
                    animeId: anime.id,
                    animeTitle: anime.titleAr,
                    seasonNum: season.seasonNum,
                    animeImage: anime.image
                });
            });
        });
    });
    allEpisodes.sort((a, b) => b.epNum - a.epNum);
    allEpisodes = allEpisodes.slice(0, 6);

    let html = '';
    allEpisodes.forEach(ep => {
        html += `
            <div class="episode-card" onclick="goToEpisode('${ep.animeId}', ${ep.seasonNum}, ${ep.epNum})">
                <div class="card-image">
                    ${ep.animeImage}
                    <div class="play-btn">▶</div>
                </div>
                <div class="card-info">
                    <div class="card-title">${ep.animeTitle}</div>
                    <div class="card-meta">${ep.epTitle}</div>
                    <span class="card-episode-num">الحلقة ${ep.epNum}</span>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function loadAnimeList() {
    const container = document.getElementById('animeList');
    let html = '';
    animeDB.forEach(anime => {
        const totalEpisodes = anime.seasons.reduce((sum, s) => sum + s.episodes.length, 0);
        html += `
            <div class="anime-card" onclick="goToAnime('${anime.id}')">
                <div class="card-image">
                    ${anime.image}
                    <div class="play-btn">▶</div>
                </div>
                <div class="card-info">
                    <div class="card-title">${anime.titleAr}</div>
                    <div class="card-meta">${anime.status} • ${totalEpisodes} حلقة</div>
                    <div class="card-meta">⭐ ${anime.rating}</div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function goToAnime(animeId) { window.location.href = `anime.html?id=${animeId}`; }
function goToEpisode(animeId, seasonNum, epNum) { window.location.href = `episode.html?anime=${animeId}&season=${seasonNum}&ep=${epNum}`; }

function searchAnime() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (!query) return;
    const results = animeDB.filter(a => a.title.toLowerCase().includes(query) || a.titleAr.includes(query));
    if (results.length === 1) { goToAnime(results[0].id); }
    else if (results.length > 1) {
        const container = document.getElementById('animeList');
        let html = '';
        results.forEach(anime => {
            const totalEpisodes = anime.seasons.reduce((sum, s) => sum + s.episodes.length, 0);
            html += `
                <div class="anime-card" onclick="goToAnime('${anime.id}')">
                    <div class="card-image">${anime.image}</div>
                    <div class="card-info">
                        <div class="card-title">${anime.titleAr}</div>
                        <div class="card-meta">${totalEpisodes} حلقة</div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
        document.getElementById('anime-list').scrollIntoView({ behavior: 'smooth' });
    } else { alert('لم يتم العثور على نتائج'); }
}

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.getElementById('searchInput') === document.activeElement) searchAnime();
});
