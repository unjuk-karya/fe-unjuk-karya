import CreateSource from '../../../src/scripts/data/create-source';

export async function categoriesProduct(createProductElement) {
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
}
