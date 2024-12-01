import CONFIG from './config';

const API_ENDPOINT = {
  LOGIN: `${CONFIG.BASE_URL}api/v1/auth/login`,
  REGISTER: `${CONFIG.BASE_URL}api/v1/auth/register`,
  EXPLORE: `${CONFIG.BASE_URL}api/v1/posts`,
  USER_PROFILE: (userId) => `${CONFIG.BASE_URL}api/v1/users/${userId}/profile`,
  USER_POSTS: (userId) => `${CONFIG.BASE_URL}api/v1/users/${userId}/posts`,
};

export default API_ENDPOINT;
