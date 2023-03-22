import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const gallerySlider = new SimpleLightbox('.gallery__link');

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

export default renderPhotos;
