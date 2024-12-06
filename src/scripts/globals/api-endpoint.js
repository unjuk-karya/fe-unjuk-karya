import CONFIG from '../../../env.js';

const API_ENDPOINT = {
  POST_LOGIN: `${CONFIG.BASE_URL}auth/login`, // POST
  POST_REGISTER: `${CONFIG.BASE_URL}auth/register`, // POST
  GET_USER_PROFILE: (userId) => `${CONFIG.BASE_URL}users/${userId}/profile`, // GET
  GET_USER_POSTS: (userId, page = 1, pageSize = 8) =>
    `${CONFIG.BASE_URL}users/${userId}/posts?page=${page}&pageSize=${pageSize}`, // GET
  GET_USER_LIKED_POSTS: (userId, page = 1, pageSize = 8) =>
    `${CONFIG.BASE_URL}users/${userId}/liked-posts?page=${page}&pageSize=${pageSize}`, // GET
  POST_FOLLOW_USER: (userId) => `${CONFIG.BASE_URL}users/${userId}/follow`, // POST
  GET_ALL_POSTS: (page = 1, pageSize = 8) =>
    `${CONFIG.BASE_URL}posts?page=${page}&pageSize=${pageSize}`, // GET
  GET_FEED_POSTS: (page = 1, pageSize = 8) =>
    `${CONFIG.BASE_URL}posts/feed?page=${page}&pageSize=${pageSize}`, // GET
  GET_COMMENTS_BY_POST_ID: (postId, page = 1, pageSize = 5) =>
    `${CONFIG.BASE_URL}posts/${postId}/comments?page=${page}&pageSize=${pageSize}`, // GET
  POST_SAVES: (postId) => `${CONFIG.BASE_URL}posts/${postId}/saves`, // POST
  POST_COMMENTS: (postId) => `${CONFIG.BASE_URL}posts/${postId}/comments`, // POST
  POST_COMMENT_LIKES: (postId, commentId) =>
    `${CONFIG.BASE_URL}posts/${postId}/comments/${commentId}/likes`, // POST
  DELETE_COMMENTS: (postId, commentId) =>
    `${CONFIG.BASE_URL}posts/${postId}/comments/${commentId}`, // DELETE
  SEARCH_USER: (query) => `${CONFIG.BASE_URL}users/search?q=${query}`, // GET
  GET_FOLLOWERS: (userId) => `${CONFIG.BASE_URL}users/${userId}/followers`, // GET
  GET_FOLLOWINGS: (userId) => `${CONFIG.BASE_URL}users/${userId}/followings`, // GET

  POST_BY_ID: (postId) => `${CONFIG.BASE_URL}posts/${postId}`, // GET/PUT
  POST_LIKES: (postId) => `${CONFIG.BASE_URL}posts/${postId}/likes`, // GET&POST
};

export default API_ENDPOINT;