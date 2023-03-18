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
        safesearch: true,
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
    gallery.innerHTML = '';
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      notifyOptions
    );
  }

  Notify.success(`Hooray! We found ${totalHits} images.`, notifyOptions);

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
}
