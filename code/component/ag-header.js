class AgHeader extends HTMLElement {
  constructor() {
    super();
    this.css = `
      @import url('../styles/fonts.css');

      header {
        position: sticky;
        top: 0;
        z-index: 1000;
        padding: var(--p-md) var(--p-sm);
        background-color: var(--hdr-bg-color, #1a365d);
        display: flex;
        align-items: center;
        min-height: 50px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .logo {
        display: inline-flex;
        align-items: center;
        margin-right: auto;
        gap: 8px;
        justify-content: center;
      }

      .logo img {
        width: var(--logo-size);
        height: var(--logo-size);
      }

      .logo-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 2px;
        margin: 0;
      }

      .logo-main {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .logo h1 {
        color: var(--bg-color);
        font-size: var(--fs-2xl);
        font-family: 'Rubik', sans-serif;
        margin: 0;
        gap:0;
        padding:0;
      }

      .logo h1>span {
        color: var(--primary);
      }

      .logo p {
        color: var(--primary-2);
        font-size: var(--fs-xs);
        font-weight: bold;
        font-family: 'Rubik', sans-serif;
        margin: 0;
        line-height: 1.2;
      }

      .header-nav {
        display: flex;
        gap: var(--gap-size-s);
        align-items: center;
      }

      .header-nav a {
        color: var(--primary-5);
        font-size: 14px;
        font-family: 'NunitoSans', sans-serif;
        text-transform: uppercase;
        text-decoration: none;
        transition: color 0.3s;
        font-weight: 500;
      }

      .header-nav a:hover {
        color: var(--primary);
      }

      .search-container {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .header-nav input {
        background-color: var(--primary-5, #2d3748);
        border-radius: 20px;
        border: none;
        height: 36px;
        padding: 0 16px;
        color: white;
        width: 200px;
        font-family: 'NunitoSans', sans-serif;
      }

      .header-nav input::placeholder {
        color: var(--text-color-2, #a0aec0);
        font-family: 'NunitoSans', sans-serif;
      }

      .header-nav input:focus {
        outline: 2px solid var(--primary, #48bb78);
        outline-offset: 2px;
      }

      .search-btn {
        display: inline-flex;
        background-color: var(--primary-5, #2d3748);
        border-radius: 50%;
        border: none;
        align-items: center;
        justify-content: center;
        height: 36px;
        width: 36px;
        transition: all 0.3s;
        cursor: pointer;
      }

      .search-btn svg {
        height: 18px;
        width: 18px;
        color: var(--primary, #48bb78);
        transition: 0.3s;
      }

      .search-btn:hover {
        background-color: var(--primary, #48bb78);
      }

      .search-btn:hover svg {
        color: white;
      }

      .header-nav a.is-active {
        color: var(--primary, #48bb78);
        font-weight: 700;
      }

      /* User section styles */
      .user-section {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-left: 20px;
      }

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--primary-5, #4a5568);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-color-2, #a0aec0);
        font-weight: normal;
        font-size: 20px;
        cursor: pointer;
        border: 2px dashed var(--text-color-3, #718096);
        transition: all 0.3s;
      }

      .user-avatar::before {
        content: "?";
        font-weight: normal;
      }

      .user-avatar:hover {
        border-color: var(--primary, #48bb78);
        background-color: var(--primary-5, #2d3748);
        color: var(--primary, #48bb78);
      }

      /* Mobile menu styles */
      .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 8px;
        margin-left: 16px;
      }

      .mobile-nav {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: var(--hdr-bg-color, #1a365d);
        padding: 20px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }

      .mobile-nav.active {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .mobile-nav a {
        color: white;
        text-decoration: none;
        font-family: 'NunitoSans', sans-serif;
        text-transform: uppercase;
        padding: 12px;
        border-radius: 6px;
        transition: background-color 0.3s;
      }

      .mobile-nav a:hover,
      .mobile-nav a.is-active {
        background-color: var(--primary, #48bb78);
        color: white;
      }

      .mobile-user-section {
        display: none;
        flex-direction: column;
        align-items: center;
        padding: 16px;
        border-top: 1px solid #2d3748;
        margin-top: 16px;
      }

      /* Responsive styles */
      @media (max-width: 780px) {
        header {
          padding: 10px 12px;
          min-height: 60px;
        }

        .logo{
          display: flex;
          margin-right: auto;
          align-items: center;
          justify-content: center;
        }

        .logo img {
          width: 32px;
          height: 32px;
        }

        .logo h1 {
          font-size: 18px;
        }

        .logo p {
          font-size: 9px;
        }

        .header-nav {
          display: none;
        }

        .mobile-menu-btn {
          display: block;
        }

        .user-section {
          display: none;
        }

        .mobile-user-section {
          display: flex;
        }

        .mobile-user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary-5, #4a5568);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-color-2, #a0aec0);
          font-size: 18px;
          border: 2px dashed var(--text-color-3, #718096);
          margin-bottom: 8px;
        }

        .mobile-user-avatar::before {
          content: "?";
          font-weight: normal;
        }

        .search-container {
          display: none;
        }

        .mobile-search {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        .mobile-search input {
          flex: 1;
          background-color: #2d3748;
          border: none;
          border-radius: 20px;
          padding: 12px 16px;
          color: white;
          font-family: 'NunitoSans', sans-serif;
        }

        .mobile-search input::placeholder {
          color: #a0aec0;
        }
      }

      @media (max-width: 480px) {
        header {
          padding: 8px 10px;
          min-height: 56px;
        }

        .logo-content {
          display: none;
        }

        .logo-main {
          display: flex;
        }

        .logo h1 {
          font-size: 16px;
        }
      }

      /* Animation for mobile menu */
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .mobile-nav.active {
        animation: slideDown 0.3s ease-out;
      }
    `;
  }

  connectedCallback() {
    this.render();
    this.markActiveLink();
    this.setupMobileMenu();
  }

  render() {
    this.innerHTML = `
      <style>${this.css}</style>
      <header>
        <div class="logo">
          <img src="../files/logo.svg" alt="Logo">
          <div class="logo-content">
            <div class="logo-main">
              <h1>Ayal<span>GO</span></h1>
            </div>
            <p>Discover Mongolia<br>your way</p>
          </div>
        </div>
        
        <div class="header-nav">
          <a href="home.html">Нүүр Хуудас</a>
          <a href="spots.html">Аяллын Цэгүүд</a>
          <a href="plan.html">Миний Төлөвлөгөө</a>
          <div class="search-container">
            <input type="text" placeholder="Хайлт хийх..">
            <button class="search-btn">
              <svg>
                <use href="../styles/icons.svg#icon-search"></use>
              </svg>
            </button>
          </div>
          <div class="user-section">
            <div class="user-avatar" title="Бүртгүүлээгүй"></div>
          </div>
        </div>

        <button class="mobile-menu-btn" aria-label="Цэс нээх">
          ☰
        </button>

        <div class="mobile-nav">
          <a href="home.html">Нүүр Хуудас</a>
          <a href="spots.html">Аяллын Цэгүүд</a>
          <a href="plan.html">Миний Төлөвлөгөө</a>
          
          <div class="mobile-search">
            <input type="text" placeholder="Хайлт хийх..">
            <button class="search-btn">
              <svg>
                <use href="../styles/icons.svg#icon-search"></use>
              </svg>
            </button>
          </div>

          <div class="mobile-user-section">
            <div class="mobile-user-avatar" title="Бүртгүүлээгүй"></div>
          </div>
        </div>
      </header>
    `;
  }

  markActiveLink() {
    let currentPath = window.location.pathname.split("/").pop();
    if (!currentPath) {
      currentPath = "home.html"; 
    }

    const links = this.querySelectorAll(".header-nav a[href]");
    const mobileLinks = this.querySelectorAll(".mobile-nav a[href]");
    
    const allLinks = [...links, ...mobileLinks];
    
    allLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentPath) {
        link.setAttribute("aria-current", "page");
        link.classList.add("is-active");
      }
    });
  }

  setupMobileMenu() {
    const mobileMenuBtn = this.querySelector('.mobile-menu-btn');
    const mobileNav = this.querySelector('.mobile-nav');

    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      
      if (mobileNav.classList.contains('active')) {
        mobileMenuBtn.textContent = '✕';
        mobileMenuBtn.setAttribute('aria-label', 'Цэс хаах');
      } else {
        mobileMenuBtn.textContent = '☰';
        mobileMenuBtn.setAttribute('aria-label', 'Цэс нээх');
      }
    });

    document.addEventListener('click', (e) => {
      if (!this.contains(e.target) && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        mobileMenuBtn.textContent = '☰';
        mobileMenuBtn.setAttribute('aria-label', 'Цэс нээх');
      }
    });

    const mobileLinks = this.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        mobileMenuBtn.textContent = '☰';
        mobileMenuBtn.setAttribute('aria-label', 'Цэс нээх');
      });
    });
  }
}

customElements.define("ag-header", AgHeader);