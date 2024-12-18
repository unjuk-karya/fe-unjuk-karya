import CreateSource from '../../../data/create-source';
import { categoriesProduct } from '../../../utils/categories-product';
import Swal from 'sweetalert2';
import ProfileSource from '../../../data/profile-source';

const CreateProduct = {
  async render() {
    return `
      <div class="container">
        <create-product></create-product>
      </div>
    `;
  },

  async afterRender() {
    const createProductElement = document.querySelector('create-product');
    const submitButton = createProductElement.shadowRoot.querySelector('#submit-button');
    const mobileSubmitButton = createProductElement.shadowRoot.querySelector('#mobile-submit-button');

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;
    let profileData;
    try {
      profileData = await ProfileSource.getUserProfile(userId);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: error,
        text: 'Gagal mengambil data profil pengguna.',
      });
      return;
    }

    const midtransServerKey = profileData.midtransServerKey;
    const midtransClientKey = profileData.midtransClientKey;

    if (!midtransServerKey || !midtransClientKey) {
      Swal.fire({
        icon: 'warning',
        title: 'Penting!',
        text: 'Anda perlu mengisi informasi midtrans di profil Anda terlebih dahulu.',
      }).then(() => {
        window.location.href = `#/edit-profile/${userId}`;
      });
      return;
    }

    // Get Category
    await categoriesProduct(createProductElement);

    // Handle Submit Button
    submitButton.addEventListener('click', (event) => {
      this.handleSubmit(createProductElement, event);
    });
    mobileSubmitButton.addEventListener('click', (event) => {
      this.handleSubmit(createProductElement, event);
    });
  },

  // Handle Submit Button
  async handleSubmit(createPostElement, event) {
    event.preventDefault();

    const name = createPostElement.shadowRoot.querySelector('#name').value;
    let price = createPostElement.shadowRoot.querySelector('#price').value;
    const stock = createPostElement.shadowRoot.querySelector('#stock').value;

    const categorySelect = createPostElement.shadowRoot.querySelector('#category');
    const category = categorySelect.value;

    const description = createPostElement.shadowRoot.querySelector('#description').value;
    const fileInput = createPostElement.shadowRoot.querySelector('#file-input');
    const imageFile = fileInput.files[0];

    price = price.replace(/[^\d]/g, '');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', imageFile);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('categoryId', category);

    const loadingAlert = Swal.fire({
      title: 'Membuat produk...',
      text: 'Tunggu sebentar sementara kami membuat produk Anda.',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    try {
      const response = await CreateSource.createProduct(formData);

      if (response.status === 201) {
        loadingAlert.close();
        Swal.fire({
          icon: 'success',
          title: 'Produk Dibuat',
          text: 'Produk Anda telah berhasil dibuat.',
        }).then(() => {
          window.location.href = '#/home';
        });

        createPostElement.shadowRoot.querySelector('form').reset();
        fileInput.value = '';
      } else {
        throw new Error(response.message || 'Pembuatan produk gagal');
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

};

export default CreateProduct;
