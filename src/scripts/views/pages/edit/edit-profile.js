import ProfileSource from '../../../data/profile-source';
import Swal from 'sweetalert2';

const EditProfile = {
  async render() {
    return `
      <div class="container">
        <edit-profile></edit-profile>
      </div>
    `;
  },

  async afterRender() {
    const editProfileElement = document.querySelector('edit-profile');

    // Profile Picture Elements
    const profilePicturePreview = editProfileElement.shadowRoot.querySelector('#profile-picture-preview');
    const profilePictureInput = editProfileElement.shadowRoot.querySelector('#profile-picture-input');
    const profilePictureDelete = editProfileElement.shadowRoot.querySelector('#profile-picture-delete-icon');
    let profilePictureFile = null;

    // Cover Picture Elements
    const coverPicturePreview = editProfileElement.shadowRoot.querySelector('#cover-picture-preview');
    const coverPictureInput = editProfileElement.shadowRoot.querySelector('#cover-picture-input');
    const coverPictureDelete = editProfileElement.shadowRoot.querySelector('#cover-picture-delete-icon');
    let coverPictureFile = null;

    // Personal Details Form Elements
    const nameInput = editProfileElement.shadowRoot.querySelector('#name');
    const usernameInput = editProfileElement.shadowRoot.querySelector('#username');
    const emailInput = editProfileElement.shadowRoot.querySelector('#email');
    const phoneInput = editProfileElement.shadowRoot.querySelector('#phone-number');
    const addressInput = editProfileElement.shadowRoot.querySelector('#address');
    const bioInput = editProfileElement.shadowRoot.querySelector('#bio');
    const submitButton = editProfileElement.shadowRoot.querySelector('#submit-btn');
    const nameValidation = editProfileElement.shadowRoot.querySelector('.name-validation');
    const usernameValidation = editProfileElement.shadowRoot.querySelector('.username-validation');
    const emailValidation = editProfileElement.shadowRoot.querySelector('.email-validation');

    const url = window.location.hash;
    const postId = url.split('/')[2];

    // Input Validation
    const validateInputs = () => {
      const nameValid = nameInput.value.trim().length > 3;
      const usernameValid = usernameInput.value.trim().length > 3;
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());

      setValidationStyles(nameInput, nameValid, nameValidation, 'Nama harus lebih dari 3 karakter');
      setValidationStyles(usernameInput, usernameValid, usernameValidation, 'Username harus lebih dari 3 karakter');
      setValidationStyles(emailInput, emailValid, emailValidation, 'Email tidak sesuai');

      submitButton.disabled = !(nameValid && usernameValid && emailValid);
    };

    // Set Input Validation Styles
    const setValidationStyles = (input, isValid, validationElement, message) => {
      if (!isValid) {
        input.style.borderColor = 'red';
        validationElement.style.display = 'flex';
        validationElement.querySelector('.validation-message-p').textContent = message;
      } else {
        input.style.borderColor = '#dfe5ef';
        validationElement.style.display = 'none';
      }
    };

    nameInput.addEventListener('input', validateInputs);
    usernameInput.addEventListener('input', validateInputs);
    emailInput.addEventListener('input', validateInputs);

    try {
      const profileData = await ProfileSource.getUserProfile(postId);

      if (profileData.isMyself === false) {
        window.location.href = '#/not-found';
      } else {
        // Profile Photo Handling
        setImage(profilePicturePreview, profilePictureDelete, profileData.avatar);

        // Cover Photo Handling
        setImage(coverPicturePreview, coverPictureDelete, profileData.coverPhoto);

        // Fill Personal Details Form
        fillFormData(profileData);

        // Initial Validation
        validateInputs();
      }

      // Handle Profile Picture File Input
      profilePictureInput.addEventListener('change', (event) => {
        profilePictureFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function () {
          profilePicturePreview.src = reader.result;
          profilePicturePreview.style.display = 'block';
          profilePictureDelete.style.display = 'flex';
        };
        if (profilePictureFile) {
          reader.readAsDataURL(profilePictureFile);
        }
      });

      // Handle Cover Picture File Input
      coverPictureInput.addEventListener('change', (event) => {
        coverPictureFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function () {
          coverPicturePreview.src = reader.result;
          coverPicturePreview.style.display = 'block';
          coverPictureDelete.style.display = 'flex';
        };
        if (coverPictureFile) {
          reader.readAsDataURL(coverPictureFile);
        }
      });

      // Handle Form Submission
      submitButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const formData = new FormData();
        appendFormData(formData);

        try {
          Swal.fire({
            title: 'Memperbarui profil...',
            text: 'Harap tunggu sementara kami memperbarui profil Anda.',
            icon: 'info',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });

          const updatedProfile = await ProfileSource.editUserProfile(formData);

          Swal.close();
          Swal.fire({
            title: 'Berhasil!',
            text: 'Profil Anda telah berhasil diperbarui.',
            icon: 'success',
            confirmButtonText: 'Luar biasa!',
          }).then(() => {
            window.location.href = '#/profile';
          });

          console.log(updatedProfile);
        } catch (error) {
          Swal.close();

          let errorMessage = 'Terjadi kesalahan. Silakan coba lagi';

          if (error.status === 422 && error.data?.errors) {
            const validationErrors = [];

            if (error.data.errors.avatar) {
              validationErrors.push(`Avatar: ${error.data.errors.avatar.join(', ')}`);
            }
            if (error.data.errors.username) {
              validationErrors.push(`Username: ${error.data.errors.username.join(', ')}`);
            }

            errorMessage = validationErrors.join('\n');
          }

          Swal.fire({
            title: 'Terjadi Kesalahan!',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'Oke',
          });

          console.log(error);
        }
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      if (error.status === 404) {
        window.location.hash = '#/not-found';
      }
    }

    // Set Image Preview and Delete Button Visibility
    function setImage(previewElement, deleteElement, imageUrl) {
      if (imageUrl) {
        previewElement.src = imageUrl;
        previewElement.style.display = 'block';
        deleteElement.style.display = 'flex';
      } else {
        previewElement.src = '';
        previewElement.style.display = 'none';
        deleteElement.style.display = 'none';
      }
    }

    // Fill Form with Profile Data
    function fillFormData(profileData) {
      nameInput.value = profileData.name || '';
      usernameInput.value = profileData.username || '';
      emailInput.value = profileData.email || '';
      phoneInput.value = profileData.phone || '';
      addressInput.value = profileData.address || '';
      bioInput.value = profileData.bio || '';
    }

    // Append Form Data
    function appendFormData(formData) {
      formData.append('name', nameInput.value.trim());
      formData.append('username', usernameInput.value.trim());
      formData.append('email', emailInput.value.trim());
      formData.append('phone', phoneInput.value.trim());
      formData.append('address', addressInput.value.trim());
      formData.append('bio', bioInput.value.trim());

      if (profilePictureFile) {
        formData.append('avatar', profilePictureFile);
      }
      if (coverPictureFile) {
        formData.append('coverPhoto', coverPictureFile);
      }
    }
  },
};

export default EditProfile;
