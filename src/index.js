import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const btnRef = document.querySelector('.load-more');

const API_KEY = '33850777-d3532e1c860cfcd3ae11015e6';
const BASE_URL = 'https://pixabay.com/api/';
const params = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';
const pageLimit = 13;
let page = 1;

const lightbox = new SimpleLightbox('.gallery a', {
                captions: true,
                captionSelector: 'img',
                captionsData: 'alt',
                captionPosition: 'bottom',
                captionDelay: 250,
                scrollZoom: false,
            });

formRef.addEventListener('submit', (evt) => {
    const value = evt.currentTarget.elements.searchQuery.value;
    evt.preventDefault();
    clear();
    page = 1;
    
    if (!value) {
        btnHide();
        return
    }

    fetchApi(value, page)
        .then(items => {
            const totalHits = items.data.totalHits;
            const elements = items.data.hits;
            
            if (totalHits === 0) {
                btnHide();
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");
                return
            }

            creatMarkup(elements);
            lightbox.refresh();
            Notify.success(`"Hooray! We found ${totalHits} images."`);
            btnRef.style.display = 'block';
        })
        .catch(err => console.log(err));
});

btnRef.addEventListener('click', () => {
        const value = formRef.elements.searchQuery.value;
        page += 1;
        fetchApi(value, page)
            .then(items => {
                const elements = items.data.hits;
                creatMarkup(elements);
                lightbox.refresh();

                if (elements[39] === undefined || page === pageLimit) {
                    btnHide();
                    Notify.warning("We're sorry, but you've reached the end of search results.");
                }
            })
            .catch(err => {
                btnHide();
                Notify.warning("We're sorry, but you've reached the end of search results.");
                console.log(err);
            });
    });


async function fetchApi(name, page) {
    const items = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${name}&page=${page}&${params}`);
    return items;
}


function creatMarkup(arr) {
    const markup = arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
        <a href="${largeImageURL}"class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    ${likes}
                </p>
                <p class="info-item">
                    <b>Views</b>
                    ${views}
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    ${comments}
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    ${downloads}
                </p>
            </div>
        </a>`
    }).join('');
    galleryRef.insertAdjacentHTML('beforeend', markup);
}

function clear() {
    galleryRef.innerHTML = '';
}

function btnHide() {
    btnRef.style.display = 'none';
}