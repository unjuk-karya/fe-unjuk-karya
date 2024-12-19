import API_ENDPOINT from '../globals/api-endpoint';

class PostSource {
  static async getAllPosts(page = 1, pageSize = 8, search = '') {
    const token = localStorage.getItem('token');
    const searchQuery = search ? `&search=${encodeURIComponent(search)}` : '';

    const response = await fetch(`${API_ENDPOINT.GET_ALL_POSTS(page, pageSize)}${searchQuery}`, {
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

  static async getFeedPosts(page = 1, pageSize = 9) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.GET_FEED_POSTS(page, pageSize), {
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

  static async getCommentsByPostId(postId, page = 1, pageSize = 10) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.GET_COMMENTS_BY_POST_ID(postId, page, pageSize), {
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

  static async likePost(postId) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.POST_LIKES(postId), {
      method: 'POST',
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

  static async postComment(postId, content) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.POST_COMMENTS(postId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content })
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

  static async likeComment(postId, commentId) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.POST_COMMENT_LIKES(postId, commentId), {
      method: 'POST',
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

  static async deletePost(postId) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.POST_BY_ID(postId), {
      method: 'DELETE',
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

  static async deleteComment(postId, commentId) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.DELETE_COMMENTS(postId, commentId), {
      method: 'DELETE',
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
