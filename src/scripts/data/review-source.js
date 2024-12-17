import API_ENDPOINT from '../globals/api-endpoint';

class RewiewSource {
  static async createReview(orderId, reviewData) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.REVIEW(orderId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
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

  static async getReview(orderId) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.REVIEW(orderId), {
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

  static async updateReview(orderId, reviewData) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.REVIEW(orderId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
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

export default RewiewSource;