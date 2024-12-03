import API_ENDPOINT from '../globals/api-endpoint';

class PostSource {
  static async getAllPosts(page = 1, pageSize = 8) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.ALL_POST(page, pageSize), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        data: responseData
      };
    }

    return responseData.data;
  }

  static async getPostById(postId) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.POST_BY_ID(postId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        data: responseData
      };
    }

    return responseData.data;
  }

  static async getCommentsByPostId(postId, page = 1, pageSize = 5) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.COMMENTS_BY_POST_ID(postId, page, pageSize), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        data: responseData
      };
    }

    return responseData.data;
  }

  static async getPostLikes(postId) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.POST_LIKES(postId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        data: responseData
      };
    }

    return responseData.data;
  }
}

export default PostSource;