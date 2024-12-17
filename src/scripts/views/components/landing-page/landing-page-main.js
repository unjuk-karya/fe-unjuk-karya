class LandingPageMain extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this._updateStyle();
  }

  _updateStyle() {
    this._style.textContent = `
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
  
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }

    :host {
      display: block;
      
    }
    
    h1, h2, h3, p {
      color: #2a3547;  
    }
    
    h2 {
      font-size: 28px;
    }
    
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    
    .container-welcome {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 32px;
      background: #eef3ff;
      height: 100vh;
    }

    .container-welcome h1 {
      font-size: 52px;
      color: #2a3547;
      width: 80%
    }
    
    .container-welcome span {
      color: #4f73d9;
    }

    .container-welcome p {
      font-size: 18px;
      color: #2a3547;
      font-weight: 450;
    }
    
    .container-home p {
      font-size: 16px;
      color: #2a3547;
    }

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      outline: none;
      box-shadow: none;
      font-size: 14px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 11px 30px;
      border-radius: 8px;
      background: #5d87ff;
      font-weight: 600;
      color: #fff;
    }

    button:hover {
      cursor: pointer;
      background: #4f73d9;
    }

    .container-article {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      width: 50%;
    }

    .container-article img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      margin-left: -30px;
      border: 3px solid #eef3ff;
    }
    
    .container-home {
      display: grid;
      gap: 20px;
      padding: 40px;
      margin: auto;
    }

    .box {
      background-color: #fff;
      border-radius: 10px;
      text-align: center;
      padding: 20px;
      transition: transform 0.3s ease-in-out;
    }
    
    .box:hover {
      transform: translateY(-5px);
    }
    
    .container-home p {
      grid-column: span 2;
    }
    
    .new-demos {
      grid-column: span 2;
      background-color: #f0f5ff;
    }
    
    .new-demos h2 {
      margin-bottom: 10px;
    }
    
    .box p {
      margin-top: 8px
    }
    
    .new-demos img {
      max-width: 100%;
      margin-top: 10px;
    }
    
    .box img {
      width: 50px;
      margin-bottom: 15px;
    }
    
    hr {
      width: 95%;
      border: none;
      height: 2px;
      background-color: #ccc;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .container-about {
      display: flex;
      flex-direction: column;
      padding: 20px 40px;
      width: 100%;
    }
    
    .container-about article {
      text-align: left;
    }
    
    .container-about article p {
      margin-top: 8px
    }

    .leadership-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
    
    .member {
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    .member-image img {
      height: 300px;
      width: 100%;
      object-fit: cover;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .member-info {
      width: 80%;
      position: absolute;
      bottom: 0;
      transform: translateX(-50%);
      display: inline-flex;
      flex-direction: column;
      background: #eef3ff;
      padding: 8px;
      border-radius: 8px;
      margin-bottom: -20px;
    }
    
    .member-info h3 {
      font-size: 18px;
      font-weight: 590;
    }
    
    .member-info p {
      font-size: 14px;
      margin-top: 4px;
    }
    
    .container-button {
      display: flex;
      justify-content: space-between;
    }
    
    .container-button button {
      display: none;
    }
    
    .container-button button {
      background: none;
      color: #2a3547;
      font-size: 21px;
      font-weight: 550;
      padding: 0;
    }
    
    .container-button button:hover {
      cursor: pointer;
      color: #4f73d9;
    }
    
    @media (max-width: 930px) {
      .leadership-cards {
        display: flex;
        gap: 20px;
        margin: 20px 0;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 20px;
      }
      
      .member {
        flex: 0 0 calc(50% - 50px);
        scroll-snap-align: start;
        position: relative;
      }
      
      .member-image img {
        width: 320px;
        height: 300px;
        object-fit: cover;
      }
      
      .leadership-cards::-webkit-scrollbar {
        display: none;
      }
      
      .container-button button {
        display: flex;
      }
    }
    
    @media (max-width: 768px) {
    
      .container-welcome {
        padding: 0 16px;
      }
      
      .container-welcome h1 {
        font-size: 32px;
        width: 100%
      }

      .container-article {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 8px;
        width: 90%;
      }

      .container-article img {
        width: 50px;
        height: 50px;
        margin-left: 0;
      }

      .container-article p {
        flex-basis: 100%;
        text-align: center;
      }
      
      .container-home {
        display: grid;
        gap: 20px;
        padding: 16px;
        margin: auto;
      }
      
      .box {
        grid-column: span 2;
      }
      
      .container-about {
        display: flex;
        padding: 16px;
        width: 100%;
      }
      
      .container-about article {
        text-align: left;
        width: 100%;
      }
      
      .member-image img {
        width: 250px;
      }
    }
  `;
  }

  connectedCallback() {
    this.render();
    this._addScrollFunctionality();
  }

  render() {
    this._shadowRoot.appendChild(this._style);

    this._shadowRoot.innerHTML += `
      <div class="container">
        <div class="container-welcome">
          <h1>Platform sosial media untuk <span>komunitas seniman</span> Indonesia</h1>
          <div class="container-article">
            <img src="./images/user-1.jpg" alt="Image 1">
            <img src="./images/user-2.jpg" alt="Image 2">
            <img src="./images/user-3.jpg" alt="Image 3">
            <p>Tempat bagi seniman untuk berjualan, berkolaborasi, dan terhubung dengan seniman lainnya di seluruh Indonesia.</p>
          </div>
          <button class="join">Gabung sekarang</button>
        </div>
        <div class="container-home">
          <p>Tempat Terbaik bagi Seniman untuk Berjualan, Berkolaborasi, dan Terhubung dengan Seniman di Seluruh Indonesia!</p>
          
          <div class="box light-dark" style="background-color: #fef5e5">
            <img src="./images/box-1.svg" alt="Light & Dark" />
            <h3>Marketplace</h3>
            <p>Tempat bagi seniman untuk menjual karya mereka</p>
          </div>
      
          <div class="box app-designs" style="background-color: #ecf8ff">
            <img src="./images/box-5.svg" alt="Application Designs" />
            <h3>Komunitas</h3>
            <p>Berinteraksi dan berkolaborasi dengan sesama seniman</p>
          </div>
      
          <div class="box new-demos" style="background-color: #eef3ff">
            <h2>Kolaborasi Antar Seniman</h2>
            <p>Fasilitasi kolaborasi antar seniman untuk menciptakan karya</p>
            <img src="./images/box-6.svg" alt="New Demos Preview" />
          </div>
      
          <div class="box code-improvements" style="background-color: #ecf8ff">
            <img src="./images/box-3.svg" alt="Code Improvements" />
            <h3>Exhibition Virtual</h3>
            <p>Menampilkan karya seni seniman untuk memperkenalkan karya</p>
          </div>
      
          <div class="box ui-components" style="background-color: #fbf2ef">
            <img src="./images/box-4.svg" alt="UI Components" />
            <h3>Easy to Used</h3>
            <p>Menyediakan berbagai fitur canggih untuk menduking seniman</p>
          </div>
        </div>
        <hr>
       
        <div class="container-about">
          <article>
            <h2>Tentang Kami</h2>
            <p>Tim pengembang yang berdedikasi untuk menciptakan platform ini</p>
          </article>
          
          <div class="leadership-cards">
            <div class="member">
              <div class="member-image">
                <img src="./images/kris.jpg" alt="Alex Martinez">
              </div>
              <div class="member-info">
                <h3>Krisna Diva</h3>
                <p>Back-End Dev</p>
              </div>
            </div>
            
            <div class="member">
              <div class="member-image">
                <img src="./images/muktii.jpg" alt="Jordan Nguyen">
              </div>
              <div class="member-info">
                <h3>Mukti Prabowo</h3>
                <p>Front-End Dev</p>
              </div>
            </div>
            
            <div class="member">
              <div class="member-image">
                <img src="./images/bangdila.jpg" alt="Taylor Roberts">
              </div>
              <div class="member-info">
                <h3>Muhammad Dila</h3>
                <p>Front-End Dev</p>
              </div>
            </div>
            
            <div class="member">
              <div class="member-image">
                <img src="./images/ros.jpg" alt="Morgan Patel">
              </div>
              <div class="member-info">
                <h3>Rosmayanti</h3>
                <p>Project Manager</p>
              </div>
            </div>
          </div>
          
          <div class="container-button">
            <button class="scroll-btn right-btn">
              <i class="fas fa-chevron-right"></i>
            </button>
            
            <button class="scroll-btn left-btn">
              <i class="fas fa-chevron-left"></i>
            </button>
          </div>
        </div>
        </div>
      </div>
    `;
  }

  _addScrollFunctionality() {
    const cardsContainer = this._shadowRoot.querySelector('.leadership-cards');
    const leftBtn = this._shadowRoot.querySelector('.left-btn');
    const rightBtn = this._shadowRoot.querySelector('.right-btn');

    leftBtn.addEventListener('click', () => {
      cardsContainer.scrollBy({
        left: -cardsContainer.offsetWidth / 2,
        behavior: 'smooth'
      });
    });

    rightBtn.addEventListener('click', () => {
      cardsContainer.scrollBy({
        left: cardsContainer.offsetWidth / 2,
        behavior: 'smooth'
      });
    });
  }

}

customElements.define('landing-page-main', LandingPageMain);
