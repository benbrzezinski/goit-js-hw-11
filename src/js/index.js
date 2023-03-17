import axios from 'axios';
import { Notify } from 'notiflix';

const searchForm = document.querySelector('.search-form');
const searcher = document.querySelector('.search-form__searcher');
const searchFormBtn = document.querySelector('.search-form__btn');
const gallery = document.querySelector('.gallery');
const notifyOptions = {
  position: 'center-top',
  distance: '80px',
  timeout: 4000,
  pauseOnHover: false,
};
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
        safesearch: false,
        per_page: 40,
        page,
      },
    });

    return await resp.data;
  } catch (error) {
    console.error(error.stack);
  }
};

const getPhotos = async e => {
  e.preventDefault();

  const photos = await fetchPhotos(page);
  const { total, totalHits, hits: arrayOfPhotos } = photos;
  console.log(arrayOfPhotos);
  console.log(total);
  console.log(totalHits);

  if (!arrayOfPhotos.length) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      notifyOptions
    );
  }

  gallery.innerHTML = '';
  renderPhotos(arrayOfPhotos);
};

searchForm.addEventListener('submit', getPhotos);

function renderPhotos(arrayOfPhotos) {
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
                  <div class="photo-info">
                    <p class="photo-info__item">
                        <b>Likes</b> ${likes}
                    </p>
                    <p class="photo-info__item">
                        <b>Views</b> ${views}
                    </p>
                    <p class="photo-info__item">
                        <b>Comments</b> ${comments}
                    </p>
                    <p class="photo-info__item">
                        <b>Downloads</b> ${downloads}
                    </p>
                  </div>
                </div>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', photoTags);
}
