import CreatePostSource from '../../data/create-source';
import Swal from 'sweetalert2';

const Create = {
  async render() {
    return `
      <div class="container">
        <create-post></create-post>
      </div>
    `;
  },

  async afterRender() {
    const createPostElement = document.querySelector('create-post');
    const submitButton = createPostElement.shadowRoot.querySelector('#submit-button');
    const mobileSubmitButton = createPostElement.shadowRoot.querySelector('#mobile-submit-button');

    const handleSubmit = async (event) => {
      event.preventDefault();

      const title = createPostElement.shadowRoot.querySelector('#title').value;
      const description = createPostElement.shadowRoot.querySelector('#description').value;
      const fileInput = createPostElement.shadowRoot.querySelector('#file-input');
      const imageFile = fileInput.files[0];

      if (!title || !description || !imageFile) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'All fields are required.',
        });
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', description);
      formData.append('image', imageFile);

      const loadingAlert = Swal.fire({
        title: 'Creating post...',
        text: 'Please wait while we create your post.',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      try {
        const response = await CreatePostSource.createPost(formData);

        if (response.status === 201) {
          loadingAlert.close();
          Swal.fire({
            icon: 'success',
            title: 'Post Created',
            text: 'Your post has been successfully created.',
          }).then(() => {
            window.location.href = '#/';
          });

          createPostElement.shadowRoot.querySelector('form').reset();
          fileInput.value = '';
        } else {
          throw new Error(response.message || 'Post creation failed');
        }
      } catch (error) {
        loadingAlert.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      }
    };

    submitButton.addEventListener('click', handleSubmit);
    mobileSubmitButton.addEventListener('click', handleSubmit);
  }

};

export default Create;
