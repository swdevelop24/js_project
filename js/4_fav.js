
const API_KEY = 'cIsraDXQ585MS1XBmgDJEAdAT8ZOfyGl8JyKFqTl';
const API_URL = `https://developer.nps.gov/api/v1/parks?limit=500&api_key=${API_KEY}`;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

async function fetchFavorites() {
    const response = await fetch(API_URL);
    const data = await response.json();
    const parksData = data.data;
    const favoriteParks = parksData.filter(p => favorites.includes(p.id));

    const container = document.getElementById('favoritesContainer');
    container.innerHTML = '';

    if (favoriteParks.length === 0) {
        container.innerHTML = "<p>No favorite parks selected.</p>";
        return;
    }

    favoriteParks.forEach(park => {
        container.innerHTML += `
    <div class="park-card">
        <span class="favorite-icon" onclick="removeFavorite(event, '${park.id}')">❤️</span>
        <img src="${park.images.length ? park.images[0].url : 'https://via.placeholder.com/200x150'}" onclick="window.location.href='../pages/3_detail.html?id=${park.id}'">
        <h3>${park.fullName}</h3>
    </div>`;
    });
}

function removeFavorite(event, parkId) {
    event.stopPropagation();
    favorites = favorites.filter(id => id !== parkId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    fetchFavorites();
}

function clearFavorites() {
    localStorage.removeItem('favorites');
    favorites = [];
    fetchFavorites();
}

fetchFavorites();
