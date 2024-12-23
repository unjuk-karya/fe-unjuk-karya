import CreatePostSource from '../../../data/create-source';
import Swal from 'sweetalert2';

const CreatePost = {
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
          title: 'Ups...',
          text: 'Semua kolom harus diisi.',
        });
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', description);
      formData.append('image', imageFile);

      const loadingAlert = Swal.fire({
        title: 'Membuat postingan...',
        text: 'Tunggu sebentar sementara kami membuat postingan Anda.',
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
            title: 'Postingan Dibuat',
            text: 'Postingan Anda telah berhasil dibuat.',
          }).then(() => {
            window.location.href = '#/home';
          });

          createPostElement.shadowRoot.querySelector('form').reset();
          fileInput.value = '';
        } else {
          throw new Error(response.message || 'Pembuatan postingan gagal');
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

export default CreatePost;
