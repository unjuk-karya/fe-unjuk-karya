import API_ENDPOINT from '../globals/api-endpoint';

const EditPostSource = {
  async editPost(postId, formData) {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(API_ENDPOINT.EDIT_POST(postId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to edit post');
      }

      return data;
    } catch (error) {
      console.error('Error:', error.message);
      throw new Error(error.message || 'Something went wrong!');
    }
  },
};

export default EditPostSource;