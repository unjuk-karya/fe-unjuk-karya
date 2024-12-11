import Swal from 'sweetalert2';
import ProfileSource from '../../data/profile-source';

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
    const shadowRoot = editProfileElement.shadowRoot;

    // Profile Picture Elements
    const profilePicturePreview = shadowRoot.querySelector('#profile-picture-preview');
    const profilePictureInput = shadowRoot.querySelector('#profile-picture-input');
    const profilePictureDelete = shadowRoot.querySelector('#profile-picture-delete-icon');
    const profilePictureFile = null;

    // Cover Picture Elements
    const coverPicturePreview = shadowRoot.querySelector('#cover-picture-preview');
    const coverPictureInput = shadowRoot.querySelector('#cover-picture-input');
    const coverPictureDelete = shadowRoot.querySelector('#cover-picture-delete-icon');
    const coverPictureFile = null;

    // Personal Details Elements
    const nameInput = shadowRoot.querySelector('#name');
    const usernameInput = shadowRoot.querySelector('#username');
    const emailInput = shadowRoot.querySelector('#email');
    const phoneInput = shadowRoot.querySelector('#phone-number');
    const addressInput = shadowRoot.querySelector('#address');
    const bioInput = shadowRoot.querySelector('#bio');
    const submitButton = shadowRoot.querySelector('#submit-btn');

    const postId = window.location.hash.split('/')[2];

    // Initialize Input Validation
    const validateInputs = () => {
      const nameValid = nameInput.value.trim().length > 3;
      const usernameValid = usernameInput.value.trim().length > 3;
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
      submitButton.disabled = !(nameValid && usernameValid && emailValid);
    };

    // Set up Input Event Listeners for Validation
    nameInput.addEventListener('input', validateInputs);
    usernameInput.addEventListener('input', validateInputs);
    emailInput.addEventListener('input', validateInputs);

    // Handle Profile Data Fetching and UI Updates
    try {
      const profileData = await ProfileSource.getUserProfile(postId);

      if (!profileData.isMyself) {
        window.location.href = '#/not-found';
      } else {
        updateProfileUI(profileData);
        validateInputs();
      }

      // Handle Profile Form Submit
      submitButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const formData = createFormData(profilePictureFile, coverPictureFile);
        await submitProfileForm(formData);
      });

    } catch (error) {
      console.error('Failed to fetch profile:', error);
      if (error.status === 404) {
        window.location.hash = '#/not-found';
      }
    }

    // Helper function to update UI with fetched profile data
    function updateProfileUI(profileData) {
      setProfilePictureUI(profileData.avatar, profilePicturePreview, profilePictureDelete);
      setCoverPictureUI(profileData.coverPhoto, coverPicturePreview, coverPictureDelete);
      fillFormFields(profileData);
    }

    // Helper function to set Profile Picture UI
    function setProfilePictureUI(avatar, previewElement, deleteElement) {
      if (avatar) {
        previewElement.src = avatar;
        previewElement.style.display = 'block';
        deleteElement.style.display = 'flex';
      } else {
        previewElement.src = '';
        previewElement.style.display = 'none';
        deleteElement.style.display = 'none';
      }
    }

    // Helper function to set Cover Picture UI
    function setCoverPictureUI(coverPhoto, previewElement, deleteElement) {
      if (coverPhoto) {
        previewElement.src = coverPhoto;
        previewElement.style.display = 'block';
        deleteElement.style.display = 'flex';
      } else {
        previewElement.src = '';
        previewElement.style.display = 'none';
        deleteElement.style.display = 'none';
      }
    }

    // Helper function to fill form fields with profile data
    function fillFormFields(profileData) {
      nameInput.value = profileData.name || '';
      usernameInput.value = profileData.username || '';
      emailInput.value = profileData.email || '';
      phoneInput.value = profileData.phone || '';
      addressInput.value = profileData.address || '';
      bioInput.value = profileData.bio || '';
    }

    // Handle Profile Picture Input Change
    profilePictureInput.addEventListener('change', (event) => handleFileInputChange(event, profilePicturePreview, profilePictureDelete, profilePictureFile));
    profilePictureDelete.addEventListener('click', () => clearFileInput(profilePicturePreview, profilePictureDelete, profilePictureInput, profilePictureFile));

    // Handle Cover Picture Input Change
    coverPictureInput.addEventListener('change', (event) => handleFileInputChange(event, coverPicturePreview, coverPictureDelete, coverPictureFile));
    coverPictureDelete.addEventListener('click', () => clearFileInput(coverPicturePreview, coverPictureDelete, coverPictureInput, coverPictureFile));

    // Helper function to handle file input change (both profile and cover picture)
    function handleFileInputChange(event, previewElement, deleteElement) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewElement.src = e.target.result;
          previewElement.style.display = 'block';
          deleteElement.style.display = 'flex';
        };
        reader.readAsDataURL(file);
      }
    }

    // Helper function to clear file input (both profile and cover picture)
    function clearFileInput(previewElement, deleteElement, inputElement) {
      previewElement.src = '';
      previewElement.style.display = 'none';
      deleteElement.style.display = 'none';
      inputElement.value = '';
    }

    // Create FormData from input values and files
    function createFormData(profilePictureFile, coverPictureFile) {
      const formData = new FormData();
      formData.append('name', nameInput.value.trim());
      formData.append('username', usernameInput.value.trim());
      formData.append('email', emailInput.value.trim());
      formData.append('phone', phoneInput.value.trim());
      formData.append('address', addressInput.value.trim());
      formData.append('bio', bioInput.value.trim());
      formData.append('avatar', profilePictureFile);
      formData.append('coverPhoto', coverPictureFile);

      return formData;
    }

    // Button Submit Profile
    async function submitProfileForm(formData) {
      const loadingAlert = Swal.fire({
        title: 'Memperbarui profil...',
        text: 'Tunggu sebentar sementara kami memperbarui profil Anda.',
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      try {
        const updatedProfile = await ProfileSource.editUserProfile(formData);

        if (updatedProfile.status === 200) {
          loadingAlert.close();
          Swal.fire({
            icon: 'success',
            title: 'Profil Diperbarui',
            text: 'Profil Anda telah berhasil diperbarui.',
          }).then(() => {
            window.location.href = '#/';
          });
        } else {
          loadingAlert.close();
          Swal.fire({
            icon: 'error',
            title: 'Gagal Memperbarui Profil',
            text: 'Terjadi kesalahan saat memperbarui profil.',
          });
        }
      } catch (error) {
        loadingAlert.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      }
    }
  }
};

export default EditProfile;
