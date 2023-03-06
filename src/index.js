import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import fetchApi from './js/fetch';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const btnRef = document.querySelector('.load-more');

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
    evt.preventDefault();
    btnHide();
    const value = evt.currentTarget.elements.searchQuery.value;
    clear();
    page = 1;
    
    if (!value) {
        return
    }

    fetchApi(value, page)
        .then(items => {
            const totalHits = items.data.totalHits;
            const elements = items.data.hits;
            
            if (totalHits === 0) {
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");
                return
            }

            creatMarkup(elements);
            lightbox.refresh();
            Notify.success(`"Hooray! We found ${totalHits} images."`);
            btnShow();
        })
        .catch(err => console.log(err));
});

btnRef.addEventListener('click', () => {
    btnHide();
    const value = formRef.elements.searchQuery.value;
    page += 1;
        fetchApi(value, page)
            .then(items => {
                const elements = items.data.hits;
                creatMarkup(elements);
                lightbox.refresh();
                btnShow();

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
function btnShow() {
    btnRef.style.display = 'block';
}