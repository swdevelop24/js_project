const API_KEY = 'cIsraDXQ585MS1XBmgDJEAdAT8ZOfyGl8JyKFqTl'; // 여기에 NPS API 키 입력
const urlParams = new URLSearchParams(window.location.search);
const parkId = urlParams.get('id');

// NPS API는 `id` 필터가 없기 때문에, 모든 공원을 가져온 후 필터링해야 함.
const API_URL = `https://developer.nps.gov/api/v1/parks?limit=500&api_key=${API_KEY}`;

async function fetchParkDetails() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // 공원 데이터에서 해당 `parkId` 찾기
        const park = data.data.find(p => p.id === parkId);

        if (!park) {
            throw new Error("Park not found");
        }

        // HTML 요소 업데이트
        document.getElementById('parkTitle').textContent = park.fullName;
        document.getElementById('parkImage').src = park.images.length ? park.images[0].url : 'https://via.placeholder.com/600x400';
        document.getElementById('parkLocation').textContent = park.states;
        document.getElementById('parkDescription').textContent = park.description || "No description available.";
    } catch (error) {
        console.error("Error fetching park details:", error);
        document.getElementById('parkTitle').textContent = "Park not found";
        document.getElementById('parkDescription').textContent = "We couldn't find details for this park.";
    }
}

// 데이터 가져오기
fetchParkDetails();