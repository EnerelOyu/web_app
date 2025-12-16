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
        background-color: var(--hdr-bg-color);
        display: flex;
        align-items: center;
        min-height: 50px;
        box-shadow: 0 2px 10px color-mix(in srgb, var(--text-color-0) 15%, transparent);
      }

      .logo {
        display: inline-flex;
        align-items: center;
        margin-right: auto;
        gap: var(--gap-size-s);
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
        gap: var(--gap-size-xxs);
        margin: 0;
      }

      .logo-main {
        display: flex;
        align-items: center;
        gap: var(--gap-size-xs);
      }

      .logo h1 {
        color: var(--logo-text);
        font-size: var(--fs-2xl);
        font-family: 'Rubik';
        margin: 0;
        padding: 0;
      }

      .logo h1 > span {
        color: var(--primary);
      }

      .logo p {
        color: var(--primary-2);
        font-size: var(--fs-xs);
        font-weight: bold;
        font-family: 'Rubik';
        margin: 0;
      }

      .header-nav {
        display: flex;
        gap: var(--gap-size-s);
        align-items: center;
      }

      .header-nav a {
        color: var(--primary-5);
        font-size: var(--fs-sm);
        font-family: 'NunitoSans';
        text-transform: uppercase;
        text-decoration: none;
        transition: color 0.3s;
        font-weight: 500;
      }

      .header-nav a:hover {
        color: var(--primary);
      }

      .header-nav a.is-active {
        color: var(--primary);
        font-weight: 700;
      }

      /* === SEARCH === */

      .search-container {
        display: flex;
        align-items: center;
        gap: var(--gap-size-s);
      }

      .header-nav input {
        background-color: var(--primary-5);
        border-radius: var(--br-m);
        border: none;
        height: var(--svg-m);
        padding: 0 var(--p-md);
        color: var(--text-color-1);
        width: 200px;
        font-family: 'NunitoSans';
      }

      .header-nav input::placeholder {
        color: var(--text-color-4);
      }

      .header-nav input:focus {
        outline: 2px solid var(--primary);
      }

      .search-btn, .user-btn{
        display: inline-flex;
        background-color: var(--primary-5);
        border-radius: 50%;
        border: none;
        align-items: center;
        justify-content: center;
        height: var(--svg-m);
        width: var(--svg-m);
        cursor: pointer;
        transition: 0.3s;
      }

      .search-btn svg, .user-btn svg{
        width: var(--svg-s);
        height: var(--svg-s);
        transition: 0.3s;
        color: var(--primary);
      }

      .search-btn:hover{
        background-color: var(--primary);
      }

      .search-btn:hover svg {
        color: var(--primary-5);
        transform: rotate(90deg);

      }

      /* === USER AVATAR === */

      .user-btn{
        border: 2px dotted var(--primary);
      }

      .user-btn:hover {
        transform: scale(1.08);
        background-color: var(--primary);
      }

      .user-btn:hover svg{
        color: var(--primary-5);
      }

      /* === THEME TOGGLE === */

      .theme-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--svg-m);
        height: var(--svg-m);
        border-radius: 50%;
        border: none;
        cursor: pointer;
        background-color: var(--primary-5);
        color: var(--primary);
        transition: 0.3s;

      }

      .theme-toggle svg {
        width: var(--svg-s);
        height: var(--svg-s);
        stroke: currentColor;
        fill: none;
      }
      
      .theme-toggle:hover{
        background-color: var(--primary);
      }
      
      .theme-toggle:hover svg{
        color: var(--primary-5);
        transform: rotate(90deg);

      }

      .hidden {
        display: none;
      }


      /* === MOBILE === */

      .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        font-size: var(--fs-xl);
        cursor: pointer;
        padding: var(--p-xs);
        margin-left: var(--m-xs);
      }

      .mobile-menu-btn svg {
        width: var(--svg-m);
        height: var(--svg-m);
        color: var(--primary);
      }

      .mobile-nav {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: var(--hdr-bg-color);
        padding: var(--p-lg);
      }

      .mobile-nav.active {
        display: flex;
        flex-direction: column;
        gap: var(--gap-size-s);
      }

      .mobile-nav a {
        color: var(--text-color-8);
        padding: var(--p-sm);
        border-radius: var(--br-s);
        text-decoration: none;
        font-family: 'NunitoSans';
        text-transform: uppercase;
        font-size: var(--fs-sm);
      }

      .mobile-nav a:hover,
      .mobile-nav a.is-active {
        background-color: var(--primary);
        color: var(--bg-color);
      }

      .mobile-theme-toggle-wrapper {
        display: none;
        justify-content: center;
        margin-top: var(--m-sm);
      }

      /* === RESPONSIVE === */

      @media (max-width: 780px) {
        .header-nav { display: none; }
        .mobile-menu-btn { display: block; }
        .mobile-theme-toggle-wrapper { display: flex; }
      }

      @media (max-width: 480px) {
        .logo-content { display: none; }
        .logo h1 { font-size: var(--fs-base); }
      }
    `;
  }

  connectedCallback() {
    this.render();
    this.markActiveLink();
    this.setupMobileMenu();
    this.setupThemeToggle();
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
          </div>
        </div>

        <div class="header-nav">
          <a href="#/home">Нүүр Хуудас</a>
          <a href="#/spots">Аяллын Цэгүүд</a>
          <a href="#/plan">Миний Төлөвлөгөө</a>

          <div class="search-container">
            <input type="text" placeholder="Хайлт хийх..">
            <button class="search-btn" type="button">
              <svg><use href="../styles/icons.svg#icon-search"></use></svg>
            </button>
          </div>

          <button class="theme-toggle" type="button">
            <svg class="icon-moon"><use href="../styles/icons.svg#icon-moon"></use></svg>
            <svg class="icon-sun hidden"><use href="../styles/icons.svg#icon-sun"></use></svg>
          </button>

          <button class="user-btn">
            <svg><use href="../styles/icons.svg#icon-user"></use></svg>
          </button>
        </div>

        <button class="mobile-menu-btn" type="button" aria-label="Цэс нээх">
          <svg><use href="../styles/icons.svg#icon-menu"></use></svg>
        </button>

        <div class="mobile-nav">
          <a href="#/home">Нүүр Хуудас</a>
          <a href="#/spots">Аяллын Цэгүүд</a>
          <a href="#/plan">Миний Төлөвлөгөө</a>

          <div class="mobile-theme-toggle-wrapper">
            <button class="theme-toggle mobile-theme-toggle" type="button">
              <svg class="icon-moon"><use href="../styles/icons.svg#icon-moon"></use></svg>
              <svg class="icon-sun hidden"><use href="../styles/icons.svg#icon-sun"></use></svg>
            </button>
          </div>
        </div>
      </header>
    `;
  }

markActiveLink() {
  const update = () => {
    const currentHash = window.location.hash || "#/home";
    const links = this.querySelectorAll(".header-nav a, .mobile-nav a");

    links.forEach(link => {
      const href = link.getAttribute("href") || "";
      const isActive = href === currentHash;

      if (isActive) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      }
    });
  };

  // Эхний удаа дуудах
  update();

  // Hash өөрчлөгдөх болгонд дахин шалгана
  window.addEventListener("hashchange", update);
}

  setupMobileMenu() {
    const btn = this.querySelector(".mobile-menu-btn");
    const nav = this.querySelector(".mobile-nav");
    const useEl = btn.querySelector("use");

    const MENU_ICON = "../styles/icons.svg#icon-menu";
    const CLOSE_ICON = "../styles/icons.svg#icon-close";

    if (!btn || !nav || !useEl) return;

    const setState = (isOpen) => {
      nav.classList.toggle("active", isOpen);
      useEl.setAttribute("href", isOpen ? CLOSE_ICON : MENU_ICON);
      btn.setAttribute("aria-label", isOpen ? "Цэс хаах" : "Цэс нээх");
    };

    btn.addEventListener("click", () => {
      const isOpen = !nav.classList.contains("active");
      setState(isOpen);
    });

    // гадна талд дарахад хаах
    document.addEventListener("click", (e) => {
      if (!this.contains(e.target) && nav.classList.contains("active")) {
        setState(false);
      }
    });

    // mobile линк дарахад хаах
    const mobileLinks = this.querySelectorAll(".mobile-nav a");
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => setState(false));
    });
  }

  setupThemeToggle() {
    const html = document.documentElement;
    const STORAGE_KEY = "ayalgo-theme";
    const buttons = this.querySelectorAll(".theme-toggle");

    if (!buttons.length) return;

    const getInitial = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    const updateIcons = (theme) => {
      buttons.forEach(btn => {
        const sun = btn.querySelector(".icon-sun");
        const moon = btn.querySelector(".icon-moon");
        if (!sun || !moon) return;

        if (theme === "dark") {
          sun.classList.remove("hidden");
          moon.classList.add("hidden");
        } else {
          sun.classList.add("hidden");
          moon.classList.remove("hidden");
        }
      });
    };

    const applyTheme = (theme) => {
      html.dataset.theme = theme;
      localStorage.setItem(STORAGE_KEY, theme);
      updateIcons(theme);
    };

    const toggle = () => {
      applyTheme(html.dataset.theme === "dark" ? "light" : "dark");
    };

    applyTheme(getInitial());
    buttons.forEach(btn => btn.addEventListener("click", toggle));
  }
}

customElements.define("ag-header", AgHeader);