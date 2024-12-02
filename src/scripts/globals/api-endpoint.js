import CONFIG from './config';

const API_ENDPOINT = {
  LOGIN: `${CONFIG.BASE_URL}api/v1/auth/login`,
  REGISTER: `${CONFIG.BASE_URL}api/v1/auth/register`,
  ALL_POST: `${CONFIG.BASE_URL}api/v1/posts`,
  USER_PROFILE: (userId) => `${CONFIG.BASE_URL}api/v1/users/${userId}/profile`,
  USER_POSTS: (userId) => `${CONFIG.BASE_URL}api/v1/users/${userId}/posts`,
  POST_BY_ID: (postId) => `${CONFIG.BASE_URL}api/v1/posts/${postId}`,
  COMMENTS_BY_POST_ID: (postId) => `${CONFIG.BASE_URL}api/v1/posts/${postId}/comments`
};

export default API_ENDPOINT;