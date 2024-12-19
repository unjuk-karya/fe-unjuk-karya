import CONFIG from '../../../env.js';

const API_ENDPOINT = {
  POST_LOGIN: `${CONFIG.BASE_URL}auth/login`, // POST
  POST_REGISTER: `${CONFIG.BASE_URL}auth/register`, // POST
  CHANGE_PASSWORD: `${CONFIG.BASE_URL}auth/change-password`, // POST
  GET_USER_PROFILE: (userId) => `${CONFIG.BASE_URL}users/${userId}/profile`, // GET
  GET_USER_POSTS: (userId, page = 1, pageSize = 8) =>
    `${CONFIG.BASE_URL}users/${userId}/posts?page=${page}&pageSize=${pageSize}`, // GET
  GET_USER_LIKED_POSTS: (userId, page = 1, pageSize = 8) =>
    `${CONFIG.BASE_URL}users/${userId}/liked-posts?page=${page}&pageSize=${pageSize}`, // GET
  GET_USER_SAVED_PRODUCTS: (userId, page = 1, pageSize = 8) =>
    `${CONFIG.BASE_URL}users/${userId}/saved-products?page=${page}&pageSize=${pageSize}`, // GET
  POST_FOLLOW_USER: (userId) => `${CONFIG.BASE_URL}users/${userId}/follow`, // POST
  GET_ALL_POSTS: (page = 1, pageSize = 8) =>
    `${CONFIG.BASE_URL}posts?page=${page}&pageSize=${pageSize}`, // GET
  GET_FEED_POSTS: (page = 1, pageSize = 9) =>
    `${CONFIG.BASE_URL}posts/feed?page=${page}&pageSize=${pageSize}`, // GET
  GET_COMMENTS_BY_POST_ID: (postId, page = 1, pageSize = 10) =>
    `${CONFIG.BASE_URL}posts/${postId}/comments?page=${page}&pageSize=${pageSize}`, // GET
  PRODUCT_SAVES: (productId) => `${CONFIG.BASE_URL}products/${productId}/saves`, // POST
  POST_COMMENTS: (postId) => `${CONFIG.BASE_URL}posts/${postId}/comments`, // POST
  POST_COMMENT_LIKES: (postId, commentId) =>
    `${CONFIG.BASE_URL}posts/${postId}/comments/${commentId}/likes`, // POST
  DELETE_COMMENTS: (postId, commentId) =>
    `${CONFIG.BASE_URL}posts/${postId}/comments/${commentId}`, // DELETE
  SEARCH_USER: (query) => `${CONFIG.BASE_URL}users/search?q=${query}`, // GET
  GET_FOLLOWERS: (userId) => `${CONFIG.BASE_URL}users/${userId}/followers`, // GET
  GET_FOLLOWINGS: (userId) => `${CONFIG.BASE_URL}users/${userId}/followings`, // GET
  REVIEW: (orderId) => `${CONFIG.BASE_URL}orders/${orderId}/reviews`, // POST/GET/PUT
  POST_BY_ID: (postId) => `${CONFIG.BASE_URL}posts/${postId}`, // GET/PUT/DELETE
  POST_LIKES: (postId) => `${CONFIG.BASE_URL}posts/${postId}/likes`, // POST&GET
  GET_ALL_PRODUCTS: (page = 1, pageSize = 8) =>
    `${CONFIG.BASE_URL}products?page=${page}&pageSize=${pageSize}`, // GET
  GET_PRODUCT_DETAIL: (productId) => `${CONFIG.BASE_URL}products/${productId}`, // GET
  GET_PRODUCT_REVIEWS: (productId, page = 1, pageSize = 5) =>
    `${CONFIG.BASE_URL}products/${productId}/reviews?page=${page}&pageSize=${pageSize}`, // GET
  GET_USER_PRODUCTS: (userId, page = 1, pageSize = 8) =>
    `${CONFIG.BASE_URL}users/${userId}/products?page=${page}&pageSize=${pageSize}`, // GET
  GET_ORDER_HISTORY: (page = 1, pageSize = 8) =>
    `${CONFIG.BASE_URL}orders/history?page=${page}&pageSize=${pageSize}`, // GET`
  CREATE_ORDER: `${CONFIG.BASE_URL}orders`, // POST
  CANCEL_ORDER: (orderId) => `${CONFIG.BASE_URL}orders/${orderId}/cancel`, // PUT
  CREATE: `${CONFIG.BASE_URL}posts`,
  EDIT_PROFILE: `${CONFIG.BASE_URL}users/profile`,
  CREATE_PRODUCT: `${CONFIG.BASE_URL}products`,
  CATEGORIES_PRODUCT: `${CONFIG.BASE_URL}categories`,
  EDIT_PRODUCT: (productId) => `${CONFIG.BASE_URL}products/${productId}`,
  DELETE_PRODUCT: (productId) => `${CONFIG.BASE_URL}products/${productId}`,
};

export default API_ENDPOINT;
