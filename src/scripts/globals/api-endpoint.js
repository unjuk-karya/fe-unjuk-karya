import CONFIG from './config';

const API_ENDPOINT = {
  LOGIN: `${CONFIG.BASE_URL}auth/login`,
  REGISTER: `${CONFIG.BASE_URL}auth/register`,
  ALL_POST: (page = 1, pageSize = 8) =>
    `${CONFIG.BASE_URL}posts?page=${page}&pageSize=${pageSize}`,
  USER_PROFILE: (userId) => `${CONFIG.BASE_URL}users/${userId}/profile`,
  USER_POSTS: (userId) => `${CONFIG.BASE_URL}users/${userId}/posts`,
  POST_BY_ID: (postId) => `${CONFIG.BASE_URL}posts/${postId}`,
  COMMENTS_BY_POST_ID: (postId, page = 1, pageSize = 5) =>
    `${CONFIG.BASE_URL}posts/${postId}/comments?page=${page}&pageSize=${pageSize}`
};

export default API_ENDPOINT;