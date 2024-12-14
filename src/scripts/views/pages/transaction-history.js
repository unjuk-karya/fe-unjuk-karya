const Marketplace = {
  async render() {
    return `
        <div class="container">
          <transaction-history-index></transaction-history-index>
        </div>
        `;
  },

  async afterRender() {
  },
};

export default Marketplace;