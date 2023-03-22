import axios from 'axios';

const searcher = document.querySelector('.search-form__searcher');

const fetchPhotos = async (perPage, page) => {
  const query = searcher.value.toLowerCase().trim();
  const baseURL = 'https://pixabay.com/api/';

  try {
    const resp = await axios.get(baseURL, {
      params: {
        key: '34506283-a822befb32ba0acc5b07109c7',
        q: query,
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

export default fetchPhotos;
