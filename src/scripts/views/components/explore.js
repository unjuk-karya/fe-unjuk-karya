
class ExploreMenu extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.shadowRoot.innerHTML = `
      <style>
    @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css');
  
    :host {
      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }
  
    .container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
      padding: 20px;
    }
  
    .card {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      flex: 1 1 300px;
    }
  
    .card:focus {
      outline: 2px solid #007BFF;
    }
  
    .image-container {
      height: 200px;
      overflow: hidden;
    }
  
    .image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  
    .content {
      padding: 20px;
    }
  
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
  
    .header .profile {
      display: flex;
      align-items: center;
    }
  
    .header .profile img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 10px;
    }
  
    .header .date {
      font-size: 12px;
      color: #999;
    }
  
    .content h3 {
      margin-top: 0;
      font-size: 18px;
    }
  
    .content p {
      margin-bottom: 10px;
      font-size: 14px;
      color: #666;
    }
  
    .content .read-time {
      font-size: 12px;
      color: #999;
    }
  
    .content .actions {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-top: 10px;
      font-size: 14px;
      color: #999;
    }
  
    .content .actions .like,
    .content .actions .comment {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  
    .content .actions .like i,
    .content .actions .comment i {
      margin-right: 5px;
    }
  
    @media (max-width: 768px) {
      .container {
        flex-direction: column;
        overflow-x: hidden;
      }
  
      .card {
        flex-basis: auto;
      }
    }
  </style>
  
  <div class="container">
    <!-- Card 1 -->
    <div class="card" tabindex="0">
      <div class="image-container">
        <img src="patung.jpg" alt="Social">
      </div>
      <div class="content">
        <div class="header">
          <div class="profile">
            <img src="patung.jpg" alt="Profile">
            <span>John Doe</span>
          </div>
          <div class="date">Sat, Dec 23</div>
        </div>
        <h3>Social</h3>
        <p>As yen tumbles, gadget-loving Japan goes for secondhand iPhones</p>
        <div class="actions">
          <div class="like">
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg> 300
          </div>
          <div class="comment">
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-message-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1" /></svg> 3
          </div>
        </div>
        <p class="read-time">2 mins Read</p>
      </div>
    </div>
  
    <!-- Card 2 -->
    <div class="card" tabindex="0">
      <div class="image-container">
        <img src="patung.jpg" alt="Social">
      </div>
      <div class="content">
        <div class="header">
          <div class="profile">
            <img src="patung.jpg" alt="Profile">
            <span>Megan Fox</span>
          </div>
          <div class="date">Sat, Dec 23</div>
        </div>
        <h3> Education </h3>
        <p>As yen tumbles, gadget-loving Japan goes for secondhand iPhones</p>
        <div class="actions">
          <div class="like">
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg> 125
          </div>
          <div class="comment">
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-message-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1" /></svg> 8
          </div>
        </div>
        <p class="read-time">2 mins Read</p>
      </div>
    </div>
  
    <!-- Card 3 -->
    <div class="card" tabindex="0">
      <div class="image-container">
        <img src="patung.jpg" alt="Gadget">
      </div>
      <div class="content">
        <div class="header">
          <div class="profile">
            <img src="patung.jpg" alt="Profile">
            <span>Jane Smith</span>
          </div>
          <div class="date">Sun, Dec 23</div>
        </div>
        <h3>Gadget</h3>
        <p>Intel loses bid to revive antitrust case against patent foe Fortress</p>
        <div class="actions">
          <div class="like">
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg> 100
          </div>
          <div class="comment">
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-message-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1" /></svg> 9
          </div>
        </div>
        <p class="read-time">2 mins Read</p>
      </div>
    </div>
  
    <!-- Card 4 -->
    <div class="card" tabindex="0">
      <div class="image-container">
        <img src="patung.jpg" alt="Health">
      </div>
      <div class="content">
        <div class="header">
          <div class="profile">
            <img src="patung.jpg" alt="Profile">
            <span>Mike Johnson</span>
          </div>
          <div class="date">Sat, Dec 23</div>
        </div>
        <h3>Health</h3>
        <p>COVID outbreak deepens as more lockdowns loom in China</p>
        <div class="actions">
          <div class="like">
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg> 95
          </div>
          <div class="comment">
            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-message-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1" /></svg> 12
          </div>
        </div>
        <p class="read-time">2 mins Read</p>
      </div>
    </div>
  </div>
      `;
    }
  }
  
  customElements.define('explore-menu', ExploreMenu);
  