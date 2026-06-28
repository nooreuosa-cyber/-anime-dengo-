// ===== أنمي دنجو - Episode Watch Page =====

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get('anime');
    const seasonNum = parseInt(params.get('season'));
    const epNum = parseInt(params.get('ep'));
    if (!animeId || !seasonNum || !epNum) { window.location.href = 'index.html'; return; }
    const anime = getAnimeById(animeId);
    if (!anime) { window.location.href = 'index.html'; return; }
    const season = anime.seasons.find(s => s.seasonNum === seasonNum);
    if (!season) { window.location.href = 'index.html'; return; }
    const episode = season.episodes.find(e => e.epNum === epNum);
    if (!episode) { window.location.href = 'index.html'; return; }
    loadEpisodeInfo(anime, episode);
    loadVideoPlayer(episode);
    loadEpisodeNav(anime, season, epNum);
});

function loadEpisodeInfo(anime, episode) {
    document.getElementById('episodeInfo').innerHTML = `
        <h1>${anime.titleAr} - ${episode.epTitle}</h1>
        <div class="anime-title">الحلقة ${episode.epNum}</div>
    `;
}

function loadVideoPlayer(episode) {
    const tabsContainer = document.getElementById('playerTabs');
    const playerContainer = document.getElementById('videoPlayer');
    document.getElementById('downloadLink').href = episode.download;

    let tabsHtml = '';
    episode.players.forEach((player, index) => {
        tabsHtml += `<button class="player-tab ${index === 0 ? 'active' : ''}" onclick="switchPlayer(${index}, '${player.url}')">${player.name}</button>`;
    });
    tabsContainer.innerHTML = tabsHtml;
    if (episode.players.length > 0) loadIframe(episode.players[0].url);
}

function loadIframe(url) {
    document.getElementById('videoPlayer').innerHTML = `<iframe src="${url}" allowfullscreen allow="autoplay; encrypted-media"></iframe>`;
}

function switchPlayer(index, url) {
    document.querySelectorAll('.player-tab').forEach((tab, i) => tab.classList.toggle('active', i === index));
    loadIframe(url);
}

function loadEpisodeNav(anime, season, currentEpNum) {
    const container = document.getElementById('episodeNav');
    const episodes = season.episodes;
    const currentIndex = episodes.findIndex(e => e.epNum === currentEpNum);
    let html = '';
    if (currentIndex > 0) {
        const prevEp = episodes[currentIndex - 1];
        html += `<a href="episode.html?anime=${anime.id}&season=${season.seasonNum}&ep=${prevEp.epNum}">⬅️ الحلقة السابقة (${prevEp.epNum})</a>`;
    } else { html += '<span></span>'; }
    if (currentIndex < episodes.length - 1) {
        const nextEp = episodes[currentIndex + 1];
        html += `<a href="episode.html?anime=${anime.id}&season=${season.seasonNum}&ep=${nextEp.epNum}">الحلقة التالية (${nextEp.epNum}) ➡️</a>`;
    } else { html += '<span></span>'; }
    container.innerHTML = html;
}
