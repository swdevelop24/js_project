const API_KEY = `x8Sh4Qqd1FrUbggVKGEUfKn8fUq20JCgqKvvMyRp`;
let newsList = [];
let filteredNewsList = [];

const getParkInfo = async () => {
    const url = new URL(`https://developer.nps.gov/api/v1/newsreleases?api_key=${API_KEY}`);
    const response = await fetch(url);
    const data = await response.json();

    newsList = data.data;
    filteredNewsList = newsList;
    populateStateFilter();
    render(); 
    console.log(newsList);
};

// 필터 창에 states 값 채우기
const populateStateFilter = () => {
    const stateSelect = document.getElementById("stateFilter");

    // 뉴스 목록에서 states 값을 모두 추출하여 중복 제거
    const states = [...new Set(newsList.map(news => news.relatedParks[0].states))];

    // 추출된 states 값을 필터 옵션으로 추가
    states.forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
};

// 뉴스 항목 렌더링
const render = () => {
    let newsHTML = ``;

    // Loop through the filtered news list and display it
    newsHTML = filteredNewsList.map(news => {
        // Format the releaseDate to show as "YYYY-MM-DD HH:MM"
        const releaseDate = new Date(news.releaseDate);
        const year = releaseDate.getFullYear();
        const month = (releaseDate.getMonth() + 1).toString().padStart(2, '0'); 
        const day = releaseDate.getDate().toString().padStart(2, '0'); 
        const hours = releaseDate.getHours().toString().padStart(2, '0'); 
        const minutes = releaseDate.getMinutes().toString().padStart(2, '0'); 
        
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`; // Format as "YYYY-MM-DD HH:MM"

        return `
            <div class="container">
                <div class="row news">
                    <div class="col-lg-4 col-md-5 col-sm-12 news-image-size">
                        <img class="news-image" src="${news.image.url}" alt="${news.image.altText}" onError="this.onerror=null;this.src='https://www.shutterstock.com/image-vector/green-color-square-label-sticker-260nw-2434722227.jpg'">
                    </div>
                    <div class="col-lg-8 col-md-7 col-sm-12 news-content">
                        <h3>${news.title}</h3>
                        <p>${news.abstract}</p>
                        <a href="${news.url}" target="_blank">Read more</a>
                        <p>${news.relatedParks[0].fullName}, ${news.relatedParks[0].states}</p>
                        <p>${formattedDate}</p>  <!-- Show formatted date and time -->
                    </div>
                </div>
            </div>
        `;
    }).join(''); 

    document.getElementById("news-board").innerHTML = newsHTML;
};

// 필터 변경 시 호출되는 함수
const handleStateFilterChange = (event) => {
    const selectedState = event.target.value;

    // 선택된 주(state)가 있으면 해당 주의 뉴스만 필터링, 없으면 전체 뉴스 표시
    if (selectedState) {
        filteredNewsList = newsList.filter(news => 
            news.relatedParks[0].states === selectedState
        );
    } else {
        filteredNewsList = newsList;
    }

    // 렌더링 함수 호출하여 필터링된 뉴스 표시
    render();
};

// 검색 기능: 필터링과 검색이 동시에 가능
const filterNews = () => {
    const selectedState = document.getElementById("stateFilter") ? document.getElementById("stateFilter").value : '';  
    const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();  

    console.log("Search term:", searchTerm);

    filteredNewsList = newsList.filter(news => {
        const matchesState = selectedState ? news.relatedParks[0].states === selectedState : true;
        const matchesSearchTerm = searchTerm ? 
            (news.title.toLowerCase().includes(searchTerm) || 
             news.abstract.toLowerCase().includes(searchTerm) || 
             news.relatedParks[0].fullName.toLowerCase().includes(searchTerm)) : true;

        return matchesState && matchesSearchTerm;
    });

    render();
};

// 검색 입력 시 호출되는 함수
const handleSearchInput = (event) => {
    console.log("Search input detected:", event.target.value); // 입력 값 확인
    filterNews();
};

// 초기화
getParkInfo();

// 검색창 이벤트 핸들러
document.getElementById("searchInput").addEventListener("input", handleSearchInput);
