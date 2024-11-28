import CONFIG from './config';

const API_ENDPOINT = {
  LOGIN: `${CONFIG.BASE_URL}auth/login`,
  REGISTER: `${CONFIG.BASE_URL}auth/register`
};

export default API_ENDPOINT;
