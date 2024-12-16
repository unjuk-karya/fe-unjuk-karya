import EditPostSource from '../../../data/edit-post-source';
import PostSource from '../../../data/post-source';
import Swal from 'sweetalert2';

const EditPost = {
  async render() {
    return `
      <div class="container">
        <edit-post></edit-post>
      </div>
    `;
  },

  async afterRender() {
    const editPostElement = document.querySelector('edit-post');
    const submitButton = editPostElement.shadowRoot.querySelector('#submit-button');
    const mobileSubmitButton = editPostElement.shadowRoot.querySelector('#mobile-submit-button');

    const titleForm = editPostElement.shadowRoot.querySelector('#title');
    const descriptionForm = editPostElement.shadowRoot.querySelector('#description');
    const imagePreview = editPostElement.shadowRoot.querySelector('#image-preview');
    const fileInput = editPostElement.shadowRoot.querySelector('#file-input');

    let imageFile = null;

    const titleValidationMessage = editPostElement.shadowRoot.querySelector('.title-validation');
    const descriptionValidationMessage = editPostElement.shadowRoot.querySelector('.description-validation');

    const url = window.location.hash;
    const postId = url.split('/')[2];

    try {
      const postDetails = await PostSource.getPostById(postId);
      titleForm.value = postDetails.title;
      descriptionForm.value = postDetails.content;
      imagePreview.src = postDetails.image;
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    }

    fileInput.addEventListener('change', (event) => {
      imageFile = event.target.files[0];
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = () => {
          imagePreview.src = reader.result;
        };
        reader.readAsDataURL(imageFile);
      }
    });

    const validateInputs = () => {
      const titleValid = titleForm.value.trim().length >= 3;
      const descValid = descriptionForm.value.trim().length >= 8;

      if (!titleValid) {
        titleValidationMessage.style.display = 'flex';
        titleValidationMessage.querySelector('.validation-message-p').textContent = 'Judul harus lebih dari 3 karakter';
        titleForm.style.borderColor = 'red';
      } else {
        titleValidationMessage.style.display = 'none';
        titleForm.style.borderColor = '#dfe5ef';
      }

      if (!descValid) {
        descriptionValidationMessage.style.display = 'flex';
        descriptionValidationMessage.querySelector('.validation-message-p').textContent = 'Deskripsi harus lebih dari 10 karakter';
        descriptionForm.style.borderColor = 'red';
      } else {
        descriptionValidationMessage.style.display = 'none';
        descriptionForm.style.borderColor = '#dfe5ef';
      }

      const isValid = titleValid && descValid;
      submitButton.disabled = !isValid;
      mobileSubmitButton.disabled = !isValid;
    };

    titleForm.addEventListener('input', validateInputs);
    descriptionForm.addEventListener('input', validateInputs);

    validateInputs();

    const handleSubmit = async (event) => {
      event.preventDefault();

      const title = titleForm.value.trim();
      const description = descriptionForm.value.trim();

      if (!title || !description) {
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

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const loadingAlert = Swal.fire({
        title: 'Memperbarui postingan...',
        text: 'Tunggu sebentar sementara kami memperbarui postingan Anda.',
        didOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      try {
        const response = await EditPostSource.editPost(postId, formData);

        if (response.status === 200) {
          loadingAlert.close();
          Swal.fire({
            icon: 'success',
            title: 'Postingan Diperbarui',
            text: 'Postingan Anda telah berhasil diperbarui.',
          }).then(() => {
            window.location.href = '#/home';
          });

          editPostElement.shadowRoot.querySelector('form').reset();
        } else if (response.status === 422) {
          loadingAlert.close();
          const { errors } = response;
          const errorMessages = [];

          if (errors.title) errorMessages.push(`Title: ${errors.title.join(', ')}`);
          if (errors.content) errorMessages.push(`Content: ${errors.content.join(', ')}`);

          Swal.fire({
            icon: 'error',
            title: 'Validasi Gagal',
            html: errorMessages.join('<br>'),
          });
        } else {
          throw new Error(response.message || 'Pembaruan postingan gagal');
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
  },
};

export default EditPost;
