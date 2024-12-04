import API_ENDPOINT from '../globals/api-endpoint';

class ProfileSource {
  static async getUserProfile(userId) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.USER_PROFILE(userId), {
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

  static async getUserPosts(userId, page = 1, pageSize = 8) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.USER_POSTS(userId, page, pageSize), {
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

  static async getUserLikedPosts(userId, page = 1, pageSize = 8) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.USER_LIKED_POSTS(userId, page, pageSize), {
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

  static async followUser(userId) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.FOLLOW_USER(userId), {
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
}

export default ProfileSource;