import Swal from 'sweetalert2';
import ProductSource from '../../../data/product-source';
import EditPostSource from '../../../data/edit-post-source';
import { categoriesProduct } from '../../../utils/categories-product';

const EditProduct = {
  async render() {
    return `
      <div class="container">
        <create-product></create-product>
      </div>
    `;
  },

  async afterRender() {
    const createProductElement = document.querySelector('create-product');
    const headerTitle = createProductElement.shadowRoot.querySelector('h1');
    const descHeaderTitle = createProductElement.shadowRoot.querySelector('.header-title p');
    const submitButton = createProductElement.shadowRoot.querySelector('#submit-button');
    const mobileSubmitButton = createProductElement.shadowRoot.querySelector('#mobile-submit-button');

    headerTitle.textContent = 'Ubah Produk';
    descHeaderTitle.textContent = 'Ubah produk yang sudah ada dan sesuaikan dengan kebutuhan Anda.';

    const productId = window.location.hash.split('/')[2];

    if (productId) {
      try {
        const product = await ProductSource.getProductDetail(productId);
        console.log('Product details:', product);

        const user = localStorage.getItem('user');
        const userObject = JSON.parse(user);
        const userId = userObject.id;

        if (product.user.id !== userId) {
          window.location.href = '#/not-found';
        } else {
          await categoriesProduct(createProductElement);

          this.populateForm(createProductElement, product);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to fetch product details.',
        });
      }
    } else {
      await categoriesProduct(createProductElement);
    }

    // Handle Submit Button
    submitButton.addEventListener('click', (event) => {
      this.handleSubmit(productId, createProductElement, event);
    });
    mobileSubmitButton.addEventListener('click', (event) => {
      this.handleSubmit(productId, createProductElement, event);
    });
  },

  populateForm(createProductElement, product) {
    const imagePreview = createProductElement.shadowRoot.querySelector('#image-preview');
    const deleteIcon = createProductElement.shadowRoot.querySelector('#delete-icon');
    const nameInput = createProductElement.shadowRoot.querySelector('#name');
    const priceInput = createProductElement.shadowRoot.querySelector('#price');
    const stockInput = createProductElement.shadowRoot.querySelector('#stock');
    const descriptionInput = createProductElement.shadowRoot.querySelector('#description');
    const categorySelect = createProductElement.shadowRoot.querySelector('#category');

    if (imagePreview) imagePreview.src = product.image || '';
    if (nameInput) nameInput.value = product.name || '';
    if (priceInput) priceInput.value = product.price || '';
    if (stockInput) stockInput.value = product.stock || '';
    if (descriptionInput) descriptionInput.value = product.description || '';

    if (categorySelect) {
      const optionToSelect = categorySelect.querySelector(`option[value="${product.categoryId}"]`);
      if (optionToSelect) {
        optionToSelect.selected = true;
      } else {
        console.warn(`Category ID ${product.categoryId} not found in the options.`);
      }
    }

    if (imagePreview.src !== null) {
      imagePreview.style.display = 'block';
      deleteIcon.style.display = 'flex';
    }
  },

  async handleSubmit(productId, createPostElement, event) {
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
      const response = await EditPostSource.editProduct(productId, formData);

      if (response.status === 200) {
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

export default EditProduct;
