import throttle from 'lodash.throttle';
import { Notify } from 'notiflix';
import fetchPhotos from './fetchPhotos';
import renderPhotos from './renderPhotos';
import scrollDownAfterLoading from './scrollDown';

const THROTTLE_DELAY = 300;
const THROTTLE_OPTIONS = { leading: false, trailing: true };
const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loading = document.querySelector('.loading');
const perPage = 40;
let page;

const notifyOptions = {
  position: 'center-top',
  distance: '70px',
  timeout: 3500,
  pauseOnHover: false,
};

const notifyOptionsEndOfResults = {
  position: 'center-bottom',
  distance: '50px',
  timeout: 5000,
  pauseOnHover: false,
};

const getPhotos = async e => {
  try {
    e.preventDefault();
    page = 1;

    const photos = await fetchPhotos(perPage, page);
    const { totalHits: numberOfPhotos, hits: arrayOfPhotos } = photos;

    if (!arrayOfPhotos.length) {
      window.removeEventListener('scroll', getPhotosAtTheEndOfPage);
      window.removeEventListener('scroll', checkEndOfLastPage);
      gallery.innerHTML = '';

      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        notifyOptions
      );
    }

    Notify.success(`Hooray! We found ${numberOfPhotos} images.`, notifyOptions);

    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });

    window.removeEventListener('scroll', checkEndOfLastPage);
    gallery.innerHTML = '';

    renderPhotos(arrayOfPhotos);
    window.addEventListener('scroll', getPhotosAtTheEndOfPage);
  } catch (error) {
    console.error(error.stack);
  }
};

searchForm.addEventListener('submit', getPhotos);

const getMorePhotos = async () => {
  try {
    page++;

    const photos = await fetchPhotos(perPage, page);
    const { totalHits: numberOfPhotos, hits: arrayOfPhotos } = photos;
    const limitPages = numberOfPhotos / perPage;

    loading.classList.remove('show');
    renderPhotos(arrayOfPhotos);

    if (limitPages <= 1) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results.",
        notifyOptionsEndOfResults
      );

      return window.removeEventListener('scroll', getPhotosAtTheEndOfPage);
    }

    scrollDownAfterLoading();

    if (page >= Math.ceil(limitPages)) {
      window.removeEventListener('scroll', getPhotosAtTheEndOfPage);
      window.addEventListener('scroll', checkEndOfLastPage);
    }
  } catch (error) {
    console.error(error.stack);
  }
};

const showLoading = () => {
  loading.classList.add('show');

  setTimeout(() => {
    getMorePhotos();
  }, 500);
};

const getPhotosAtTheEndOfPage = throttle(
  () => {
    const endOfPage =
      window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 1;

    if (endOfPage) {
      showLoading();
    }
  },
  THROTTLE_DELAY,
  THROTTLE_OPTIONS
);

const checkEndOfLastPage = throttle(
  () => {
    const endOfPage =
      window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 1;

    if (endOfPage) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results.",
        notifyOptionsEndOfResults
      );

      window.removeEventListener('scroll', checkEndOfLastPage);
    }
  },
  THROTTLE_DELAY,
  THROTTLE_OPTIONS
);
