import axios from 'axios';

axios.defaults.baseURL = "https://projeto-20-memories-backend.vercel.app/";

axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.defaults.timeout = 10000;

export default axios;

