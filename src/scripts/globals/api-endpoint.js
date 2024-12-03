import CONFIG from './config';

const API_ENDPOINT = {
  LOGIN: `${CONFIG.BASE_URL}auth/login`,
  REGISTER: `${CONFIG.BASE_URL}auth/register`,
  USER_PROFILE: (userId) => `${CONFIG.BASE_URL}users/${userId}/profile`,
  USER_POSTS: (userId) => `${CONFIG.BASE_URL}users/${userId}/posts`,
  ALL_POST: (page = 1, pageSize = 8) =>
    `${CONFIG.BASE_URL}posts?page=${page}&pageSize=${pageSize}`,
  POST_BY_ID: (postId) => `${CONFIG.BASE_URL}posts/${postId}`,
  COMMENTS_BY_POST_ID: (postId, page = 1, pageSize = 5) =>
    `${CONFIG.BASE_URL}posts/${postId}/comments?page=${page}&pageSize=${pageSize}`,
  POST_LIKES: (postId) => `${CONFIG.BASE_URL}posts/${postId}/likes`
};

export default API_ENDPOINT;