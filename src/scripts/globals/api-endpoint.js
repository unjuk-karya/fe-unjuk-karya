import CONFIG from './config';

const API_ENDPOINT = {
  LOGIN: `${CONFIG.BASE_URL}auth/login`, // POST
  REGISTER: `${CONFIG.BASE_URL}auth/register`, // POST
  USER_PROFILE: (userId) => `${CONFIG.BASE_URL}users/${userId}/profile`, // GET
  USER_POSTS: (userId) => `${CONFIG.BASE_URL}users/${userId}/posts`, // GET
  ALL_POST: (page = 1, pageSize = 8) =>
    `${CONFIG.BASE_URL}posts?page=${page}&pageSize=${pageSize}`, // GET
  POST_BY_ID: (postId) => `${CONFIG.BASE_URL}posts/${postId}`, // GET
  COMMENTS_BY_POST_ID: (postId, page = 1, pageSize = 5) =>
    `${CONFIG.BASE_URL}posts/${postId}/comments?page=${page}&pageSize=${pageSize}`, // GET
  POST_LIKES: (postId) => `${CONFIG.BASE_URL}posts/${postId}/likes`, // GET&POST
  POST_SAVES: (postId) => `${CONFIG.BASE_URL}posts/${postId}/saves`, // POST
  POST_COMMENTS: (postId) => `${CONFIG.BASE_URL}posts/${postId}/comments`, // POST
  COMMENT_LIKES: (postId, commentId) =>
    `${CONFIG.BASE_URL}posts/${postId}/comments/${commentId}/likes`, // POST
  FOLLOW_USER: (userId) => `${CONFIG.BASE_URL}users/${userId}/follow`, // POST
};

export default API_ENDPOINT;