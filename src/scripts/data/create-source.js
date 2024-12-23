import API_ENDPOINT from '../globals/api-endpoint';

const CreatePostSource = {
  async createPost(formData) {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(API_ENDPOINT.CREATE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      return data;
    } catch (error) {
      console.error('Error:', error.message);

      throw new Error(error.message || 'Something went wrong!');
    }
  },

  async createProduct(formData) {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(API_ENDPOINT.CREATE_PRODUCT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      return data;
    } catch (error) {
      console.error('Error:', error.message);

      throw new Error(error.message || 'Something went wrong!');
    }
  },

  async getCategories() {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(API_ENDPOINT.CATEGORIES_PRODUCT, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log('Categories:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch categories');
      }

      return data;
    } catch (error) {
      console.error('Error:', error.message);

      throw new Error(error.message || 'Something went wrong!');
    }
  }
};

export default CreatePostSource;
