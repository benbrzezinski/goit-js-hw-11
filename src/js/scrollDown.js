const gallery = document.querySelector('.gallery');

const scrollDownAfterLoading = () => {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  const mediaQueryWidth = window.matchMedia('(max-width: 1000px)');
  const mediaQueryOrientation = window.matchMedia('(orientation: landscape)');

  if (mediaQueryWidth.matches && mediaQueryOrientation.matches) {
    return window.scrollBy({
      top: cardHeight,
      behavior: 'smooth',
    });
  }

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

export default scrollDownAfterLoading;
