let token = null; // Store the token globally

// Function to get an access token
async function getAccessToken() {
    if (token) return token; // Reuse existing token if available

    const clientId = "LtxFN9CY1QYGo1chnh1Sbu16KICh3Bg4EOJYuhEwkxeg4r7pP1";  
    const clientSecret = "1uE7UY40cjTQR8CrB6K8OZ5wgn5bUYO5CQu97ucX";

    console.log("Fetching new access token...");

    const response = await fetch("https://api.petfinder.com/v2/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: clientSecret
        })
    });

    if (!response.ok) {
        throw new Error("Failed to get access token");
    }

    const data = await response.json();
    token = data.access_token; // Save token globally
    return token;
}

async function getPets(filters = {}) {
    try {
        const token = await getAccessToken(); // Get API access token

        // Construct query parameters dynamically
        const queryParams = new URLSearchParams(filters).toString();
        const url = `https://api.petfinder.com/v2/animals?${queryParams}`;

        console.log("Fetching pets with URL:", url); // Debugging

        const response = await fetch(url, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`Error fetching pets: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Pet Data:", data.animals);
        return data.animals;
    } catch (error) {
        console.error("Error:", error);
    }
}





function displayPets(pets) {
    const frontAllPetList = document.getElementById("front-all-pet-list");
    frontAllPetList.innerHTML = ""; // Clear previous results

    if (!pets || pets.length === 0) {
      frontAllPetList.innerHTML = "<p>No pets found.</p>";
        return;
    }

    pets.forEach(pet => {
        const petItem = document.createElement("div");
        petItem.classList.add("pet-card");

        // Use the first available photo or a placeholder
        const petImage = pet.photos.length ? pet.photos[0].medium : "https://via.placeholder.com/150";

        petItem.innerHTML = `
            <div class="card" style="width: 18rem;">
                <img src="${petImage}" class="card-img-top" alt="${pet.name}">
                <div class="card-body">
                    <h5 class="card-title">${pet.name}</h5>
                    <p class="card-text"><strong>Breed:</strong> ${pet.breeds.primary || "Unknown"}</p>
                    <p class="card-text"><strong>Age:</strong> ${pet.age}</p>
                    <p class="card-text"><strong>Location:</strong> ${pet.contact.address.city || "Unknown"}, ${pet.contact.address.state || "Unknown"}</p>
                </div>
            </div>
        `;
        frontAllPetList.appendChild(petItem);
    });
}

async function loadAndDisplayPets() {
  const pets = await getPets();  // 🟢 동물 데이터 가져오기 (비동기)
  displayPets(pets);             // 🟢 데이터 가져온 후 화면에 표시
}

// 🚀 페이지가 로드되면 실행
loadAndDisplayPets();