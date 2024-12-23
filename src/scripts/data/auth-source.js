import API_ENDPOINT from '../globals/api-endpoint';

class AuthSource {
  static async register(data) {
    const response = await fetch(API_ENDPOINT.POST_REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        data: responseData
      };
    }

    console.log('API Success Response:', responseData);

    return responseData;
  }

  static async login(data) {
    const response = await fetch(API_ENDPOINT.POST_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        data: responseData
      };
    }

    console.log('API Success Response:', responseData);

    return responseData.data;
  }

  static async changePassword(data) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.CHANGE_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        data: responseData
      };
    }

    console.log('Password Change Success:', responseData);

    return responseData;
  }
}

export default AuthSource;
