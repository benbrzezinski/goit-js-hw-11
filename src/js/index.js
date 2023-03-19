import axios from 'axios';
import throttle from 'lodash.throttle';
import { Notify } from 'notiflix';

const THROTTLE_DELAY = 300;
const searchForm = document.querySelector('.search-form');
const searcher = document.querySelector('.search-form__searcher');
const gallery = document.querySelector('.gallery');
const loading = document.querySelector('.loading');
const notifyOptions = {
  position: 'center-top',
  distance: '70px',
  timeout: 4000,
  pauseOnHover: false,
};
const perPage = 40;
let page = 1;

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

  window.scrollTo(0, 0);
  Notify.success(`Hooray! We found ${numberOfPhotos} images.`, notifyOptions);

  gallery.innerHTML = '';
  renderPhotos(arrayOfPhotos);
};

searchForm.addEventListener('submit', getPhotos);

const getMorePhotos = async () => {
  page++;

  const photos = await fetchPhotos(page);
  const { totalHits: numberOfPhotos, hits: arrayOfPhotos } = photos;
  const limitPages = numberOfPhotos / 40;
  loading.classList.remove('show');

  renderPhotos(arrayOfPhotos);
};

const showLoadingAndRenderPhotos = () => {
  loading.classList.add('show');

  setTimeout(() => {
    getMorePhotos();
  }, 500);
};

const checkEndOfPage = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight) {
    showLoadingAndRenderPhotos();
  }
};

window.addEventListener('scroll', throttle(checkEndOfPage, THROTTLE_DELAY));