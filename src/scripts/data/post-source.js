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

  static async savePost(postId) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.POST_SAVES(postId), {
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

    const response = await fetch(API_ENDPOINT.COMMENT_LIKES(postId, commentId), {
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

    const response = await fetch(API_ENDPOINT.COMMENT(postId, commentId), {
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