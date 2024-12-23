class NotFound extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
  
          .container {
            text-align: center;
          }
  
          .error-code {
            font-size: 8rem;
            font-weight: bold;
            background: linear-gradient(to right, #1D77E6, #EEF3FF);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
  
          h2 {
            font-size: 2rem;
            color: #333;
            margin: 1rem 0;
          }
  
          p {
            font-size: 1rem;
            color: #666;
            margin-bottom: 2rem;
          }
  
          .buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
          }
  
          .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            color: #fff;
            background-color: #1D77E6;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
          }
  
          .btn:hover {
            background-color: #0056b3;
          }
        </style>
  
        <div class="container">
          <h1 class="error-code">404</h1>
          <h2>OPPS! HALAMAN TIDAK DITEMUKAN</h2>
          <p>
            Maaf, halaman yang Anda cari tidak ada.
          </p>
          <div class="buttons">
            <a href="#/" class="btn">Kembali ke Beranda</a>
          </div>
        </div>
      `;
  }
}

customElements.define('not-found', NotFound);
