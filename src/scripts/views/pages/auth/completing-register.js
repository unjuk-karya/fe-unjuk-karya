import ProfileSource from '../../../data/profile-source';
import Swal from 'sweetalert2';

const CompletingRegister = {
  async render() {
    return `
      <completing-register></completing-register>
    `;
  },

  async afterRender() {
    const completingRegisterElement = document.querySelector('completing-register');

    // Profile Picture Elements
    const profilePicturePreview = completingRegisterElement.shadowRoot.querySelector('#profile-picture-preview');
    const profilePictureInput = completingRegisterElement.shadowRoot.querySelector('#profile-picture-input');
    const profilePictureDelete = completingRegisterElement.shadowRoot.querySelector('#profile-picture-delete-icon');
    let profilePictureFile = null;

    // Cover Picture Elements
    const coverPicturePreview = completingRegisterElement.shadowRoot.querySelector('#cover-picture-preview');
    const coverPictureInput = completingRegisterElement.shadowRoot.querySelector('#cover-picture-input');
    const coverPictureDelete = completingRegisterElement.shadowRoot.querySelector('#cover-picture-delete-icon');
    let coverPictureFile = null;

    // Personal Details Form Elements
    const nameInput = completingRegisterElement.shadowRoot.querySelector('#name');
    const usernameInput = completingRegisterElement.shadowRoot.querySelector('#username');
    const emailInput = completingRegisterElement.shadowRoot.querySelector('#email');
    const phoneInput = completingRegisterElement.shadowRoot.querySelector('#phone-number');
    const addressInput = completingRegisterElement.shadowRoot.querySelector('#address');
    const bioInput = completingRegisterElement.shadowRoot.querySelector('#bio');
    const nextBtn1 = completingRegisterElement.shadowRoot.querySelector('#nextBtn1');
    const submitButton = completingRegisterElement.shadowRoot.querySelector('#submitBtn');
    const nameValidation = completingRegisterElement.shadowRoot.querySelector('.name-validation');
    const usernameValidation = completingRegisterElement.shadowRoot.querySelector('.username-validation');
    const emailValidation = completingRegisterElement.shadowRoot.querySelector('.email-validation');

    // Input Validation
    const validateInputs = () => {
      const nameValid = nameInput.value.trim().length > 3;
      const usernameValid = usernameInput.value.trim().length > 3;
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());

      setValidationStyles(nameInput, nameValid, nameValidation, 'Nama harus lebih dari 3 karakter');
      setValidationStyles(usernameInput, usernameValid, usernameValidation, 'Username harus lebih dari 3 karakter');
      setValidationStyles(emailInput, emailValid, emailValidation, 'Email tidak sesuai');

      nextBtn1.disabled = !(nameValid && usernameValid);
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

    // Get data ID
    const url = window.location.hash;
    const dataId = url.split('/')[2];

    // Fetch Data
    try {
      const profileData = await ProfileSource.getUserProfile(dataId);

      if (profileData.isMyself === false) {
        window.location.href = '#/not-found';
      } else {
        fillFormData(profileData);
        validateInputs();
      }

      // Handle Profile Picture File Input
      profilePictureInput.addEventListener('change', (event) => {
        profilePictureFile = event.target.files[0];

        if (profilePictureFile && profilePictureFile.size > 5 * 1024 * 1024) {
          Swal.fire({
            title: 'Ukuran File Terlalu Besar!',
            text: 'Foto profil harus lebih kecil dari 5MB.',
            icon: 'error',
            confirmButtonText: 'Oke',
          });
          profilePictureInput.value = '';
          return;
        }

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

        if (coverPictureFile && coverPictureFile.size > 5 * 1024 * 1024) {
          Swal.fire({
            title: 'Ukuran File Terlalu Besar!',
            text: 'Foto latar belakang harus lebih kecil dari 5MB.',
            icon: 'error',
            confirmButtonText: 'Oke',
          });
          coverPictureInput.value = '';
          return;
        }

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

      // Handle Complete Register
      submitButton.addEventListener('click', async (event) => {
        event.preventDefault();

        const formData = new FormData();
        appendFormData(formData);

        try {
          Swal.fire({
            title: 'Melengkapi profil...',
            text: 'Harap tunggu sementara kami melengkapi profil Anda.',
            icon: 'info',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });

          const updatedProfile = await ProfileSource.editUserProfile(formData);

          Swal.close();
          Swal.fire({
            title: 'Berhasil!',
            text: 'Profil Anda telah berhasil dilengkapi.',
            icon: 'success',
            confirmButtonText: 'Luar biasa!',
          }).then(() => {
            window.location.href = '#/home';
          });

          localStorage.setItem('user', JSON.stringify(updatedProfile.data));

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
  }
};

export default CompletingRegister;
