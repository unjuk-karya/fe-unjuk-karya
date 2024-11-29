class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <footer>
          <p>Copyright © 2024 - Food.co</p>
        </footer>
      `;
  }
}

customElements.define('app-footer', AppFooter);
