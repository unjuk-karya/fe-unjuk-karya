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
};

export default CreatePostSource;
