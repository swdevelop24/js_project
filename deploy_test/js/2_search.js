const API_KEY = 'cIsraDXQ585MS1XBmgDJEAdAT8ZOfyGl8JyKFqTl';
const API_URL = `https://developer.nps.gov/api/v1/parks?limit=500&api_key=${API_KEY}`;
const noImageURL = "https://demofree.sirv.com/nope-not-here.jpg?w=150"; // Correct URL

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
    
    let placeholderText = "";
    if (id === "state") {
        placeholderText = "State";
    } else if (id === "activity") {
        placeholderText = "Activity";
    } else if (id === "parkType") {
        placeholderText = "Park Type";
    }

    select.innerHTML = `<option value="">${placeholderText}</option>`; // Set unique placeholder text

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
        let parkImageURL = (park.images && park.images.length > 0) ? park.images[0].url : noImageURL;

        let isFavorite = favorites.includes(park.id);
        let favoriteIcon = isFavorite ? '❤️' : '🤍';

        container.innerHTML += `
            <div class="park-card">
                <span class="favorite-icon ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(event, '${park.id}')">${favoriteIcon}</span>
                <img src="${parkImageURL}" alt="Park Image" onclick="window.location.href='3_detail.html?id=${park.id}'" onerror="this.src='${noImageURL}';">
                <h3>${park.fullName}</h3>
            </div>`;
    });

    document.getElementById('pageNumber').textContent = ` ${currentPage} of ${totalPages}`;
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
