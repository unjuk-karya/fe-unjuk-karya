import CONFIG from './config';

const API_ENDPOINT = {
  LOGIN: `${CONFIG.BASE_URL}api/v1/auth/login`,
  REGISTER: `${CONFIG.BASE_URL}api/v1/auth/register`,
  POST: `${CONFIG.BASE_URL}api/v1/posts`,
};

export default API_ENDPOINT;
