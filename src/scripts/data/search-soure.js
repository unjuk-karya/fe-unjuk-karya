import API_ENDPOINT from '../globals/api-endpoint';

class SearchSource {

  static async searchUser(query) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.SEARCH_USER(query), {
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

export default SearchSource;