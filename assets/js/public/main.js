import api from "../base/api.js";
import { get } from '../base/util.js';
import { loadHeader, loadFooter } from "../components/loadHF.js";
import { initializeEvents } from '../base/eventHandler.js';
import { initializePage } from '../components/search.js';
import { topButton } from '../components/topButton.js';
import { SwiperGroup } from '../components/swiperGroup.js';
import { getHighPoster } from "../components/highPoster.js";

// 2025-01-25 추가
export const initWeb = () => {
    loadHeader();
    loadFooter();
    initializeEvents();
    initializePage();
    topButton();
};

// 메인 슬라이드
async function mainSlide() {

    try {
        // json폴더의 main.json 호출
        const res = await fetch(`${api.GIT_URL}/assets/json/main.json`);
        const data = await res.json();
        const movies = data.movies;

        const slideBox = get('.mainSwiper .swiper-wrapper');

        // li 생성후 내용 만들기
        movies.forEach(movie => {
            const item = document.createElement('li');
            item.classList.add('swiper-slide');

            item.innerHTML = 
            `
                <div class="movie-imgBox">
                    <img src="${movie.Poster}">
                </div>

                <h2 class="a11y-hidden">영화 소개 영역</h2>
                <div class="movie-informationBox">
                    <h2 class="movie-title">${movie.Title}</h2>
                    <div class="movie-categoryBox">
                        <p class="movie-category">Type :</p>
                        <span class="movie-category">${movie.Genre}</span>
                    </div>
                    <ul class="movie-ratingBox">
                        <li class="rating-row">
                            <div class="rating-logo">
                                <img src="${api.GIT_URL}/assets/images/logo-imdb.svg" alt="Internet Movie Database 로고">
                            </div>
                            <p class="rating-value">${movie.Ratings[0].Value}</p>
                        </li>
                        <li class="rating-row">
                            <div class="rating-logo">
                                <img src="${api.GIT_URL}/assets/images/logo-tomato.svg" alt="Rotten Tomatoes 로고">
                            </div>
                            <p class="rating-value">${movie.Ratings[1].Value}</p>
                        </li>
                    </ul>

                    <p class="movie-description">${movie.Plot}</p>
                    <a href="${api.GIT_URL}/public/inner-view.html?id=${movie.imdbID}" class="btn-click" aria-label="영화 정보">More Info</a>
                </div>
            `;

            // slideBox의 자식 요소로 뿌리기
            slideBox.appendChild(item);

            // swiper 슬라이드 효과주기
            SwiperGroup();
        })
    } catch (error) {
        console.error('에러 발생:', error.message);
    }
}

// 하단부 인기영화시리즈 버튼 만들기
function popularSeries() {

    try {
        const slideBox2 = get('.mainBotSwiper .swiper-wrapper');

        // 영화 제목 배열화
        const popularMovies = ['Avengers', 'Spider-Man', 'Harry Potter', 'Frozen', 'Transformers', 'Dune', 'Home Alone'];
    
        // 버튼 구성하기
        popularMovies.forEach((movie) => {
            const slideList = document.createElement('li');
            slideList.classList.add('swiper-slide', 'popular-item');
    
            slideList.innerHTML = 
            `
                <a href="${api.GIT_URL}/public/result.html?search=${encodeURIComponent(movie)}&year=all&type=all">${movie}</a>
            `;
    
            slideBox2.appendChild(slideList);
        });
    
        // swiper 슬라이드로 만들기
        SwiperGroup();
    } catch (error) {
        console.error('popularSeries error: ', error);
    }
    
}

async function trendingMovies() {
    
    try {
        const res = await fetch(`${api.GIT_URL}/assets/json/trending.json`);
        const data = await res.json();
        
        const trendingMovie = data.trendingMovies;
        const seriesMovie = data.seriesMovies;

        const trendingWrap = get('.trending-swiper .swiper-wrapper');
        const seriesWrap = get('.seriesSwiper .swiper-wrapper');

        trendingMovie.forEach(movie => {
            const item = document.createElement('li');
            item.classList.add('swiper-slide');

            const Highposter = getHighPoster(movie.Poster);

            item.innerHTML = 
            `
                <a href="${api.GIT_URL}/public/inner-view.html?id=${movie.imdbID}" class="slide-item">
                    <div class="movie-imgBox">
                        <img src="${Highposter}">
                    </div>
                    <div class="movie-infoBox">
                        <h2 class="movie-title">${movie.Title}</h2>
                        <div class="movie-info">
                            <p class="movie-time">${movie.Runtime}</p>
                            <p class="movie-type">${movie.Type}</p>
                        </div>
                    </div>
                </a>
            `;

            trendingWrap.appendChild(item);
        });

        seriesMovie.forEach(movie => {
            const item = document.createElement('li');
            item.classList.add('swiper-slide');

            const firstGender = movie.Genre.split(',')[0];
            const Highposter = getHighPoster(movie.Poster);

            item.innerHTML = 
            `
                <a href="${api.GIT_URL}/public/inner-view.html?id=${movie.imdbID}" class="slide-item">
                    <div class="movie-imgBox">
                        <img src="${Highposter}">
                    </div>
                    <div class="movie-infoBox">
                        <h2 class="movie-title">${movie.Title}</h2>
                        <div class="movie-info">
                            <p class="movie-time">${movie.Runtime}</p>
                            <p class="movie-type">${firstGender}</p>
                        </div>
                    </div>
                </a>
            `;

            seriesWrap.appendChild(item);
        });
    } catch (error) {
        console.error('trendingMovies error: ', error);
    }
}

initWeb();
mainSlide();
popularSeries();
trendingMovies();