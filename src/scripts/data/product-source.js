import API_ENDPOINT from '../globals/api-endpoint';

class ProductSource {
  static async getAllProducts(page = 1, pageSize = 8) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.GET_ALL_PRODUCTS(page, pageSize), {
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

  static async getProductDetail(productId) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.GET_PRODUCT_DETAIL(productId), {
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

export default ProductSource;