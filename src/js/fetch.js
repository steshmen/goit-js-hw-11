import axios from 'axios';
const API_KEY = '33850777-d3532e1c860cfcd3ae11015e6';
const BASE_URL = 'https://pixabay.com/api/';
const params = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

export default async function fetchApi(name, page) {
    const items = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${name}&page=${page}&${params}`);
    return items;
}