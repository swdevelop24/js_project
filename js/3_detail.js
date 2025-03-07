const API_KEY = "cIsraDXQ585MS1XBmgDJEAdAT8ZOfyGl8JyKFqTl"; // 여기에 NPS API 키 입력
const urlParams = new URLSearchParams(window.location.search);
const parkId = urlParams.get("id");
const noImageURL = "https://demofree.sirv.com/nope-not-here.jpg?w=100"; // Correct Image Placeholder

// NPS API는 `id` 필터가 없기 때문에, 모든 공원을 가져온 후 필터링해야 함.
const API_URL = `https://developer.nps.gov/api/v1/parks?limit=500&api_key=${API_KEY}`;
const VISITOR_CENTERS_API_URL = `https://developer.nps.gov/api/v1/visitorcenters?api_key=${API_KEY}`;

async function fetchParkDetails() {
  try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const park = data.data.find((p) => p.id === parkId);

      if (!park) {
          throw new Error("Park not found");
      }

      // Update HTML elements with park details
      document.getElementById("parkTitle").textContent = park.fullName;
      document.getElementById("parkLocation").textContent = park.states;
      document.getElementById("parkDescription").textContent = park.description || "No description available.";

      // Set the image with a fallback
      const parkImage = document.getElementById("parkImage");
      parkImage.src = (park.images && park.images.length > 0) ? park.images[0].url : noImageURL;
      parkImage.onerror = function() { this.src = noImageURL; }; // Replace with placeholder if image fails to load

      // Fetch visitor centers if available
      fetchVisitorCenters(park.parkCode);

      // Initialize favorite button state
      updateFavoriteIcon(park.id);

      // Add event listener for the favorite icon
      document.getElementById("favoriteIcon").addEventListener("click", function () {
          toggleFavorite(park.id);
      });

  } catch (error) {
      console.error("Error fetching park details:", error);
      document.getElementById("parkTitle").textContent = "Park not found";
      document.getElementById("parkDescription").textContent = "We couldn't find details for this park.";
  }
}

function goBack() {
    if (document.referrer === "") {
        // 사용자가 이전 페이지가 없는 경우 (예: 직접 URL 입력)
        window.location.href = "../pages/2_search.html";
    } else {
        // 뒤로 갈 수 있는 경우
        history.back();
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

// Fetch park details when the page loads
fetchParkDetails();