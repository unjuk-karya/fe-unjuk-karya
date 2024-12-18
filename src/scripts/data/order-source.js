import API_ENDPOINT from '../globals/api-endpoint';

class OrderSource {
  static async getOrderHistory(page = 1, pageSize = 8) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.GET_ORDER_HISTORY(page, pageSize), {
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

  static async createOrder(orderData) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.CREATE_ORDER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
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

  static async cancelOrder(orderId) {
    const token = localStorage.getItem('token');

    const response = await fetch(API_ENDPOINT.CANCEL_ORDER(orderId), {
      method: 'PUT',
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

export default OrderSource;