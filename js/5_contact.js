const API_KEY = "cIsraDXQ585MS1XBmgDJEAdAT8ZOfyGl8JyKFqTl";  // ✅ API 키를 상수로 분리
const API_URL = `https://developer.nps.gov/api/v1/newsreleases?limit=300&api_key=${API_KEY}`;

let newsList = [];
let filteredNewsList = [];
let currentPage = 1;
const itemsPerPage = 4;

// 뉴스 데이터 가져오기
const fetchNews = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        newsList = data.data.slice(0, 300); // 300개만 가져오기
        filteredNewsList = newsList;
        sortNewsByImage(); 
        populateStateFilter();
        
        render();
    } catch (error) {
        console.error("Error fetching news:", error);
    }
};

// (State) 필터 옵션 추가
const populateStateFilter = () => {
    const stateSelect = document.getElementById("stateFilter");
    const states = [...new Set(newsList.map(news => news.relatedParks[0]?.states))];
    
    states.forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
};


// 이미지를 가진 뉴스 먼저 정렬하는 함수
const sortNewsByImage = () => {
    filteredNewsList.sort((a, b) => {
        const hasImageA = a.image?.url && a.image.url !== '';
        const hasImageB = b.image?.url && b.image.url !== '';
        return hasImageB - hasImageA; // ✅ 이미지 있는 뉴스가 먼저 오도록 정렬
    });
};


// 검색 결과가 없을 때 실행되는 함수
const showNoResultsMessage = () => {
    const newsContainer = document.getElementById("news-board");
    newsContainer.innerHTML = `<p class="no-results">검색 결과가 없습니다.</p>`;

    // 2초 후 검색창을 비우고 전체 뉴스 목록 표시
    setTimeout(() => {
        searchInput.value = ""; // 검색창 비우기
        stateFilter.value = ""; // 필터 초기화
        filteredNewsList = newsList; // 원래 뉴스 리스트 복원
        render(); // 전체 뉴스 다시 렌더링
    }, 2000);
};


// 뉴스 렌더링
const render = () => {
    const newsContainer = document.getElementById("news-board");
    newsContainer.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedNews = filteredNewsList.slice(start, end);

    if (filteredNewsList.length === 0) {
        newsContainer.innerHTML = `<p class="no-results">검색 결과가 없습니다.</p>`;
        return;
    }

    

    paginatedNews.forEach(news => {
        newsContainer.innerHTML += `
            <div class="news">
                <div class="news-image-container">
                    <img src="${news.image?.url || 'https://images.unsplash.com/photo-1592962406364-c5f2da6a1f4b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D/400x250'}">
                </div>
                <div>
                    <h3>${news.title}</h3>
                    <p>${news.abstract}</p>
                    <a href="${news.url}" target="_blank">Read more</a>
                </div>
            </div>
        `;
    });

    renderPagination();
};


// 페이지네이션 (5개씩 그룹화)
const renderPagination = () => {
    const totalPages = Math.ceil(filteredNewsList.length / itemsPerPage);
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    let groupStart = Math.floor((currentPage - 1) / 5) * 5 + 1;
    let groupEnd = Math.min(groupStart + 4, totalPages);

    paginationContainer.innerHTML += `<button class="page-btn prev-btn" onclick="changePage(${groupStart - 1})" ${groupStart === 1 ? 'disabled' : ''}>❮ Prev</button>`;

    for (let i = groupStart; i <= groupEnd; i++) {
        paginationContainer.innerHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }

    paginationContainer.innerHTML += `<button class="page-btn next-btn" onclick="changePage(${groupEnd + 1})" ${groupEnd === totalPages ? 'disabled' : ''}>Next ❯</button>`;
};

//  페이지 변경
const changePage = (page) => {
    if (page < 1 || page > Math.ceil(filteredNewsList.length / itemsPerPage)) return;
    currentPage = page;
    render();
};

// ✅ 검색 및 필터링 적용
const handleSearch = () => {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const selectedState = document.getElementById("stateFilter").value;

    filteredNewsList = newsList.filter(news => {
        const matchesSearch = searchTerm ? news.title.toLowerCase().includes(searchTerm) : true;
        const matchesState = selectedState ? news.relatedParks[0]?.states === selectedState : true;
        return matchesSearch && matchesState;
    });

    if (filteredNewsList.length === 0) {
        showNoResultsMessage(); // 검색 결과 없음 처리
    } else {
        currentPage = 1;
        render();
    }
};

// ✅ 뉴스 불러오기 실행
fetchNews();
