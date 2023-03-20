import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import throttle from 'lodash.throttle';
import { Notify } from 'notiflix';

const THROTTLE_DELAY = 300;
const searchForm = document.querySelector('.search-form');
const searcher = document.querySelector('.search-form__searcher');
const gallery = document.querySelector('.gallery');
const loading = document.querySelector('.loading');
const gallerySlider = new SimpleLightbox('.gallery__link');
const notifyOptions = {
  position: 'center-top',
  distance: '70px',
  timeout: 4500,
  pauseOnHover: false,
};
const perPage = 40;
let page;

const fetchPhotos = async page => {
  const searcherValue = searcher.value.toLowerCase().trim();
  const baseURL = 'https://pixabay.com/api/';

  try {
    const resp = await axios.get(baseURL, {
      params: {
        key: '34506283-a822befb32ba0acc5b07109c7',
        q: searcherValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page,
      },
    });

    return await resp.data;
  } catch (error) {
    console.error(error.stack);
  }
};

const renderPhotos = arrayOfPhotos => {
  const photoTags = arrayOfPhotos
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        views,
        likes,
        comments,
        downloads,
      }) => {
        return `<div class="gallery__card">
                  <a class="gallery__link" href="${largeImageURL}">
                    <img
                      class="gallery__img"
                      src="${webformatURL}" 
                      alt="${tags}" 
                      loading="lazy"
                    />
                  </a>
                  <ul class="photo-info">
                    <li class="photo-info__item">
                        <b class="photo-info__text">Likes</b>
                        <p class="photo-info__text">${likes}</p>
                    </li>
                    <li class="photo-info__item">
                        <b class="photo-info__text">Views</b>
                        <p class="photo-info__text">${views}</p>
                    </li>
                    <li class="photo-info__item">
                        <b class="photo-info__text">Comments</b>
                        <p class="photo-info__text">${comments}</p>
                    </li>
                    <li class="photo-info__item">
                        <b class="photo-info__text">Downloads</b>
                        <p class="photo-info__text">${downloads}</p>
                    </li>
                  </ul>
                </div>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', photoTags);
  gallerySlider.refresh();
};

const getPhotos = async e => {
  e.preventDefault();
  page = 1;

  const photos = await fetchPhotos(page);
  const { totalHits: numberOfPhotos, hits: arrayOfPhotos } = photos;

  if (!arrayOfPhotos.length) {
    gallery.innerHTML = '';
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      notifyOptions
    );
  }

  Notify.success(`Hooray! We found ${numberOfPhotos} images.`, {
    ...notifyOptions,
    timeout: 3000,
  });

  window.scrollTo(0, 0);
  gallery.innerHTML = '';
  renderPhotos(arrayOfPhotos);
  window.addEventListener('scroll', getPhotosAtTheEndOfPage);
};

searchForm.addEventListener('submit', getPhotos);

const getMorePhotos = async () => {
  page++;

  const photos = await fetchPhotos(page);
  const { totalHits: numberOfPhotos, hits: arrayOfPhotos } = photos;
  const limitPages = numberOfPhotos / perPage;

  loading.classList.remove('show');
  renderPhotos(arrayOfPhotos);

  if (limitPages <= 1) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results.",
      {
        ...notifyOptions,
        position: 'center-bottom',
        distance: '50px',
        timeout: 5000,
      }
    );

    return window.removeEventListener('scroll', getPhotosAtTheEndOfPage);
  }

  if (page >= Math.ceil(limitPages)) {
    window.removeEventListener('scroll', getPhotosAtTheEndOfPage);
    window.addEventListener('scroll', checkEndOfLastPage);
  }
};

const showLoading = () => {
  loading.classList.add('show');

  setTimeout(() => {
    getMorePhotos();
  }, 500);
};

const getPhotosAtTheEndOfPage = throttle(() => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    showLoading();
  }
}, THROTTLE_DELAY);

const checkEndOfLastPage = throttle(() => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results.",
      {
        ...notifyOptions,
        position: 'center-bottom',
        distance: '50px',
        timeout: 5000,
      }
    );

    window.removeEventListener('scroll', checkEndOfLastPage);
  }
}, THROTTLE_DELAY);
