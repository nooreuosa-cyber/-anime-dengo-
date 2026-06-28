// ===== أنمي دنجو - Anime Detail Page =====

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get('id');
    if (!animeId) { window.location.href = 'index.html'; return; }
    const anime = getAnimeById(animeId);
    if (!anime) { window.location.href = 'index.html'; return; }
    loadAnimeDetail(anime);
    loadEpisodesList(anime);
});

function loadAnimeDetail(anime) {
    const container = document.getElementById('animeDetail');
    const totalEpisodes = anime.seasons.reduce((sum, s) => sum + s.episodes.length, 0);
    container.innerHTML = `
        <div class="anime-poster">${anime.image}</div>
        <div class="anime-info">
            <h1>${anime.titleAr}</h1>
            <div class="anime-meta">
                <span class="rating">⭐ ${anime.rating}</span>
                <span class="status">${anime.status}</span>
                <span>${anime.type}</span>
                <span>${anime.duration}</span>
                <span>${totalEpisodes} حلقة</span>
            </div>
            <p class="anime-desc">${anime.description}</p>
        </div>
    `;
}

function loadEpisodesList(anime) {
    const container = document.getElementById('episodesList');
    let html = '';
    anime.seasons.forEach(season => {
        season.episodes.forEach(ep => {
            html += `
                <div class="episode-item" onclick="goToEpisode('${anime.id}', ${season.seasonNum}, ${ep.epNum})">
                    <div class="ep-num">${ep.epNum}</div>
                    <div class="ep-title">${ep.epTitle}</div>
                    <div class="watch-btn">▶ مشاهدة</div>
                </div>
            `;
        });
    });
    container.innerHTML = html;
}

function goToEpisode(animeId, seasonNum, epNum) { window.location.href = `episode.html?anime=${animeId}&season=${seasonNum}&ep=${epNum}`; }
