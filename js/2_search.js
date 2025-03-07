const API_KEY = 'cIsraDXQ585MS1XBmgDJEAdAT8ZOfyGl8JyKFqTl';
const API_URL = `https://developer.nps.gov/api/v1/parks?limit=500&api_key=${API_KEY}`;

let parksData = [];
let filteredParks = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentPage = 1;
const parksPerPage = 20;
const maxPages = 7;

async function fetchParks() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        parksData = data.data;
        filteredParks = parksData;
        populateFilters();
        displayParks();
    } catch (error) {
        console.error("Error fetching parks:", error);
    }
}

function populateFilters() {
    populateSelect('state', [...new Set(parksData.flatMap(p => p.states.split(', ')))]);
    populateSelect('activity', [...new Set(parksData.flatMap(p => p.activities.map(a => a.name)))]);
    populateSelect('parkType', [...new Set(parksData.map(p => p.designation))]);
}

function populateSelect(id, items) {
    const select = document.getElementById(id);
    select.innerHTML = '<option value="">Any</option>';
    items.forEach(item => {
        if (item) {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            select.appendChild(option);
        }
    });
}

function filterParks() {
    const state = document.getElementById('state').value;
    const activity = document.getElementById('activity').value;
    const parkType = document.getElementById('parkType').value;

    filteredParks = parksData.filter(p =>
        (!state || p.states.split(', ').includes(state)) &&
        (!activity || p.activities.some(a => a.name === activity)) &&
        (!parkType || p.designation === parkType)
    );

    currentPage = 1;
    displayParks();
}

function displayParks() {
    const container = document.getElementById('parkContainer');
    container.innerHTML = '';

    let totalPages = Math.min(maxPages, Math.ceil(filteredParks.length / parksPerPage));
    let start = (currentPage - 1) * parksPerPage;
    let paginatedParks = filteredParks.slice(start, start + parksPerPage);

    paginatedParks.forEach(park => {
        let isFavorite = favorites.includes(park.id);
        container.innerHTML += `
            <div class="park-card">
                <span class="favorite-icon ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(event, '${park.id}')">${isFavorite ? '❤️' : '🤍'}</span>
                <img src="${park.images.length ? park.images[0].url : 'https://via.placeholder.com/200x150'}" onclick="window.location.href='../pages/3_detail.html?id=${park.id}'">
                <h3>${park.fullName}</h3>
            </div>`;
    });

    document.getElementById('pageNumber').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;
}

function nextPage() {
    let totalPages = Math.min(maxPages, Math.ceil(filteredParks.length / parksPerPage));
    if (currentPage < totalPages) {
        currentPage++;
        displayParks();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayParks();
    }
}

function toggleFavorite(event, parkId) {
    event.stopPropagation();
    let index = favorites.indexOf(parkId);
    if (index === -1) {
        favorites.push(parkId);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayParks();
}

fetchParks();
