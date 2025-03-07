const API_KEY = "cIsraDXQ585MS1XBmgDJEAdAT8ZOfyGl8JyKFqTl"; // 여기에 NPS API 키 입력
const urlParams = new URLSearchParams(window.location.search);
const parkId = urlParams.get("id");

// NPS API는 `id` 필터가 없기 때문에, 모든 공원을 가져온 후 필터링해야 함.
const API_URL = `https://developer.nps.gov/api/v1/parks?limit=500&api_key=${API_KEY}`;
const VISITOR_CENTERS_API_URL = `https://developer.nps.gov/api/v1/visitorcenters?api_key=${API_KEY}`;

async function fetchParkDetails() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    // 공원 데이터에서 해당 `parkId` 찾기
    const park = data.data.find((p) => p.id === parkId);

    if (!park) {
      throw new Error("Park not found");
    }

    // HTML 요소 업데이트
    document.getElementById("parkTitle").textContent = park.fullName;
    document.getElementById("parkImage").src = park.images.length
      ? park.images[0].url
      : "https://via.placeholder.com/600x400";
    document.getElementById("parkLocation").textContent = park.states;
    document.getElementById("parkDescription").textContent =
      park.description || "No description available.";
    fetchVisitorCenters(park.parkCode);

    // Initialize favorite button
    updateFavoriteIcon(park.id);

    // Add event listener for the favorite icon
    document
      .getElementById("favoriteIcon")
      .addEventListener("click", function () {
        toggleFavorite(park.id);
      });
  } catch (error) {
    console.error("Error fetching park details:", error);
    document.getElementById("parkTitle").textContent = "Park not found";
    document.getElementById("parkDescription").textContent =
      "We couldn't find details for this park.";
  }
}
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function toggleFavorite(parkId) {
    let index = favorites.indexOf(parkId);
    if (index === -1) {
        favorites.push(parkId);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteIcon(parkId);
}

function updateFavoriteIcon(parkId) {
    let isFavorite = favorites.includes(parkId);
    document.getElementById('favoriteIcon').textContent = isFavorite ? '❤️' : '🤍';
}

async function fetchVisitorCenters(parkCode) {
    try {
        const response = await fetch(`${VISITOR_CENTERS_API_URL}&parkCode=${parkCode}`);
        const data = await response.json();
        const visitorCenters = data.data;

        const container = document.getElementById("visitorCenters");
        container.innerHTML = ""; // Clear existing content

        if (visitorCenters.length === 0) {
            container.innerHTML = "<p>No visitor centers found for this park.</p>";
            return;
        }

        // Select the first visitor center only
        const vc = visitorCenters[0];

        const vcElement = document.createElement("div");
        vcElement.classList.add("visitor-center-card");

        vcElement.innerHTML = `
            <p><strong>Address:</strong> ${
                vc.addresses.length
                    ? vc.addresses[0].line1 + ", " + vc.addresses[0].city + ", " + vc.addresses[0].stateCode
                    : "No address available"
            }</p>
            <p><strong>Contact:</strong> ${
                vc.contacts.phoneNumbers.length
                    ? vc.contacts.phoneNumbers[0].phoneNumber
                    : "No contact available"
            }</p>
            <p><strong>Hours:</strong> ${
                vc.operatingHours.length
                    ? vc.operatingHours[0].description
                    : "No hours available"
            }</p>
            <p>${vc.description}</p>
        `;

        container.appendChild(vcElement);

    } catch (error) {
        console.error("Error fetching visitor centers:", error);
        document.getElementById("visitorCenters").innerHTML = "<p>Could not load visitor center details.</p>";
    }
}



// 데이터 가져오기
fetchParkDetails();
