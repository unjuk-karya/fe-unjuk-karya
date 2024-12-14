import CreateSource from '../../../data/create-source';
import Swal from 'sweetalert2';

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

    // Get Category
    await this.populateCategories(createProductElement);

    // Handle Submit Button
    submitButton.addEventListener('click', (event) => {
      this.handleSubmit(createProductElement, event);
    });
    mobileSubmitButton.addEventListener('click', (event) => {
      this.handleSubmit(createProductElement, event);
    });
  },

  // Get Category
  async populateCategories(createProductElement) {
    try {
      const categoriesData = await CreateSource.getCategories();

      const categorySelect = createProductElement.shadowRoot.querySelector('#category');

      categorySelect.innerHTML = '<option value="" disabled selected>-- Pilih kategori produk --</option>';

      categoriesData.data.forEach((category) => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });

    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
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
          window.location.href = '#/';
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
