const apiKey = '';
const urlParams = new URLSearchParams(window.location.search);
const parkCode = urlParams.get('id');

async function fetchParkDetails() {
    if (!parkCode) {
        document.getElementById("parkName").innerText = "Park not found.";
        return;
    }

    const parkResponse = await fetch(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${apiKey}`);
    const parkData = await parkResponse.json();
    const park = parkData.data[0];

    document.getElementById("parkName").innerText = park.fullName;
    document.getElementById("parkImage").src = park.images?.[0]?.url || "https://via.placeholder.com/300x150";
    document.getElementById("parkDescription").innerText = park.description || "No description available.";
    document.getElementById("mapLink").href = `https://www.google.com/maps/search/?api=1&query=${park.latitude},${park.longitude}`;

    // Activities
    document.getElementById("activityList").innerHTML = park.activities?.map(a => `<li>${a.name}</li>`).join('') || "<li>No activities listed.</li>";
}

fetchParkDetails();

function goBack() {
    if (document.referrer.includes("index.html") || document.referrer === "") {
        window.location.href = "index.html";  // Go to the main page if no history
    } else {
        window.history.back();  // Navigate back
    }
}
