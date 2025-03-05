const apiKey = '';

// Fetch all parks when the page loads
window.onload = function () {
    fetchParks();
};

async function fetchParks() {
    console.log("Fetching parks...");
    const state = document.getElementById('stateFilter').value;
    const activity = document.getElementById('activityFilter').value.toLowerCase();
    const type = document.getElementById('typeFilter').value;

    let url = `https://developer.nps.gov/api/v1/parks?limit=50&api_key=${apiKey}`;
    if (state) url += `&stateCode=${state}`;
    if (type) url += `&designation=${encodeURIComponent(type)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        let parks = data.data;

        // Filter by activity if selected
        if (activity) {
            parks = parks.filter(park =>
                park.activities.some(act => act.name.toLowerCase().includes(activity))
            );
        }

        displayParks(parks); // Display parks without limiting the number
    } catch (error) {
        console.error('Error fetching parks:', error);
        document.getElementById('parkGrid').innerHTML = '<p>Error loading data.</p>';
    }
}

function displayParks(parks) {
    const grid = document.getElementById('parkGrid');
    grid.innerHTML = parks.map(park => `
        <div class="park-card" onclick="redirectToDetails('${park.parkCode}')">
            <img src="${park.images?.[0]?.url || 'https://via.placeholder.com/300x150'}" alt="${park.fullName}">
            <h3>${park.fullName}</h3>
        </div>
    `).join('');
}

function redirectToDetails(parkCode) {
    window.location.href = `park-detail.html?id=${parkCode}`;
}
