const ProductDetail = {
  async render() {
    const url = window.location.hash;
    let content = '';
    const productId = url.split('/')[2];
    content = `
          <div class="container">
            <product-detail-index product-id="${productId}"></product-detail-index>
          </div>
        `;
    return content;
  },

  async afterRender() {

  }
};

export default ProductDetail;