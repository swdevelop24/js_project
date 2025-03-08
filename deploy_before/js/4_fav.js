const API_KEY = '3luMBlVpDSU9s0coi6Lk3mrzkDqfBkaavcHrMOPH';
const API_URL = `https://developer.nps.gov/api/v1/parks?limit=500&api_key=${API_KEY}`;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];



document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchButton').addEventListener('click', filterFavorites);
});

// 공원 데이터 가져오기
async function fetchFavorites() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    parksData = data.data;
    filteredParks = parksData.filter(p => favorites.includes(p.id));
    populateFilters();
    displayFavorites();
  } catch (error) {
    console.error("Error fetching favorite parks:", error);
  }
}

// 필터 옵션 채우기 (State만)
function populateFilters() {
  const favoriteParks = parksData.filter(p => favorites.includes(p.id));

  const states = [...new Set(favoriteParks.flatMap(p => p.states.split(', ')))];

  populateSelect('state', states);
}

// select 요소에 옵션 추가
function populateSelect(id, items) {
  const select = document.getElementById(id);
  let defaultText = id === 'state' ? 'States' : '';
  select.innerHTML = `<option value="">${defaultText}</option>`;
  
  items.forEach(item => {
      if (item) {
          const option = document.createElement('option');
          option.value = item;
          option.textContent = item;
          select.appendChild(option);
      }
  });
}

// 필터 적용 (State만)
function filterFavorites() {
  const state = document.getElementById('state').value;

  filteredParks = parksData.filter(p =>
      favorites.includes(p.id) &&
      (!state || p.states.split(', ').includes(state))
  );

  displayFavorites();
}

// 즐겨찾기된 공원 표시
function displayFavorites() {
  const container = document.getElementById('favoritesContainer');
  container.innerHTML = '';

  if (filteredParks.length === 0) {
    container.innerHTML = `
    <div class="no-favorites">
        <p>No favorite parks found.</p>
    </div>
`;
    return;
  }

  filteredParks.forEach(park => {
    container.innerHTML += `
      <div class="park-card">
        <span class="favorite-icon" onclick="removeFavorite(event, '${park.id}')">❤️</span>
        <img src="${park.images.length ? park.images[0].url : 'https://via.placeholder.com/200x150'}" onclick="window.location.href='../pages/3_detail.html?id=${park.id}'">
        <h3>${park.fullName}</h3>
      </div>`;
  });
}

// 즐겨찾기 삭제
function removeFavorite(event, parkId) {
  event.stopPropagation();
  favorites = favorites.filter(id => id !== parkId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  filterFavorites();
}

// 모든 즐겨찾기 삭제
function clearFavorites() {
  localStorage.removeItem('favorites');
  favorites = [];
  filterFavorites();
}

fetchFavorites();