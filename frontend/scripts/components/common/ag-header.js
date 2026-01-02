class AgHeader extends HTMLElement {
  constructor() {
    super();
    this.css = `
      @import url('./styles/global.css');
        @import url('./styles/fonts.css');

      header {
        position: sticky;
        top: 0;
        z-index: 1000;
        padding: var(--p-sm) var(--p-lg);
        background: var(--hdr-bg-color);
        display: flex;
        align-items: center;
        min-height: 50px;
        box-shadow: 0 2px 10px color-mix(in srgb, var(--text-color-0) 15%, transparent);
      }

      /* === LOGO хэсэг === */
      .logo {
        display: inline-flex;
        align-items: center;
        margin-right: auto; 
        gap: var(--gap-size-s);
        justify-content: center;
        cursor: pointer;
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

      /* "GO" хэсгийг primary өнгөөр тодруулж байна */
      .logo h1 > span {
        color: var(--primary);
      }

      .logo h1.logo-gradient-anim {
        background: linear-gradient(120deg, var(--bg-color), var(--secondary), var(--primary), var(--accent));
        background-size: 220% 220%;
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        animation: logoGradientShift 1.6s ease;
      }

      .logo h1.logo-gradient-anim > span {
        color: inherit;
      }

      @keyframes logoGradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      .logo p {
        color: var(--primary-2);
        font-size: var(--fs-xs);
        font-weight: bold;
        font-family: 'Rubik';
        margin: 0;
      }

      /* === DESKTOP NAV === */
      .header-nav {
        display: flex;
        gap: var(--gap-size-s);
        align-items: center;
      }

      .header-nav a {
        color: var(--text-color-9);
        font-size: var(--fs-sm);
        font-family: 'NunitoSans';
        text-transform: uppercase;
        text-decoration: none;
        transition: color 0.3s;
        font-weight: 500;
        margin-left: var(--m-sm);
      }

      .header-nav a:hover {
        color: var(--primary);
      }

      /* идэвхтэй хуудасны линкийг ялгаж харуулна */
      .header-nav a.is-active {
        color: var(--primary);
        font-weight: 700;
      }

      /* === SEARCH хэсэг === */
      .search-container {
        position: relative;
        display: flex;
        align-items: center;
        gap: var(--gap-size-s);
      }

      .search-container input {
        background-color: var(--primary-5);
        border-radius: var(--br-m);
        border: none;
        height: var(--svg-m);
        padding: 0 calc(var(--p-md) + var(--svg-m)) 0 var(--p-md);
        color: var(--text-color-1);
        width: var(--textarea-max-height);
        font-family: 'NunitoSans';
      }

      .search-container input::placeholder {
        color: var(--text-color-4);
      }

      .search-container input:focus {
        outline: 2px solid var(--primary);
      }

      #header-plan {
        padding-right: var(--p-lg);
      }

      /* search, user товчнуудын ерөнхий хэлбэр */
      .search-btn, .user-btn{
        display: inline-flex;
        background-color: var(--primary-5);
        border-radius: 50%;
        border: none;
        align-items: center;
        justify-content: center;
        height: var(--svg-m);
        width: var(--svg-m);
        aspect-ratio: 1;
        cursor: pointer;
        transition: 0.3s;
      }

      .search-container .search-btn {
        position: absolute;
        right: var(--p-xs);
        top: 50%;
        transform: translateY(-50%);
        background-color: transparent;
      }

      .search-container .search-btn:hover {
        background-color: transparent;
      }

      .search-btn svg, .user-btn svg{
        width: var(--svg-s);
        height: var(--svg-s);
        transition: 0.3s;
        color: var(--primary);
      }


      .search-btn:hover svg {
        color: var(--primary);
        transform: rotate(90deg);
      }

      /* === USER ICON === */
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
        aspect-ratio: 1;
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

      /* icon нуух зориулалттай utility class */
      .hidden {
        display: none;
      }

      /* === MOBILE MENU BUTTON === */
      .mobile-menu-btn {
        display: none; /* default: desktop дээр нуусан */
        background: none;
        border: none;
        font-size: var(--fs-xl);
        cursor: pointer;
        padding: var(--p-xs);
        margin-left: var(--m-sm); 
      }

      .mobile-menu-btn .menu-icon {
        position: relative;
        width: 28px;
        height: 18px;
        display: inline-block;
      }

      .mobile-menu-btn .bar {
        position: absolute;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--primary);
        border-radius: 999px;
        transition: transform 0.25s ease, opacity 0.2s ease;
      }

      .mobile-menu-btn .bar.top {
        top: 2px;
      }

      .mobile-menu-btn .bar.bottom {
        bottom: 2px;
      }

      .mobile-menu-btn.is-open .bar.top {
        transform: translateY(6px) rotate(45deg);
      }

      .mobile-menu-btn.is-open .bar.bottom {
        transform: translateY(-6px) rotate(-45deg);
      }

      .mobile-actions {
        display: none;
        align-items: center;
        gap: var(--gap-size-xs);
        margin-left: auto;
        margin-right: var(--m-xs);
      }

      .mobile-actions .search-container input {
        width: 140px;
      }

      .mobile-actions .search-btn,
      .mobile-actions .user-btn {
        height: var(--svg-m);
        width: var(--svg-m);
      }

      /* MOBILE NAV (dropdown) */
      .mobile-nav {
        display: flex;
        flex-direction: column;
        gap: var(--gap-size-s);
        position: absolute;
        top: 100%;  /* header-ийн доор гарна */
        left: 0;
        right: 0;
        background: var(--hdr-bg-color);
        padding: var(--p-lg);
        max-height: 0;
        opacity: 0;
        transform: translateY(-10px);
        overflow: hidden;
        pointer-events: none;
        transition: max-height 0.45s cubic-bezier(0.2, 0.8, 0.2, 1),
                    opacity 0.35s ease,
                    transform 0.35s ease;
      }

      /* active үед л харагдана */
      .mobile-nav.active {
        max-height: 520px;
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
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

      /* === RESPONSIVE BREAKPOINTS === */
      @media (max-width: 1030px) {
        .header-nav > a { display: none; }          
        .mobile-menu-btn { display: block; }     /* hamburger show */
        .inline-wrap { display: none; }
      }

      @media (max-width: 480px) {
        .header-nav { display: none; }           /* desktop nav-ийг нуух */
        .mobile-actions { display: none; }      /* 480px-д actions-ийг нуух */
        .logo h1 { font-size: var(--fs-base); }
        .logo { margin-right: var(--m-md); }     /* logo болон mobile menu хоорондох зай */
        .inline-wrap {display: flex; flex-direction: collumn; gap: var(--gap-size-m); justify-content: center;}
        header {justify-content: space-between;}
      }
    `;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' }); // Shadow DOM үүсгэх
    this.render();            // HTML/CSS-ийг зурна
    this.markActiveLink();    // одоо байгаа hash дээр тулгуурлаад active линк тэмдэглэнэ
    this.setupMobileMenu();   // mobile menu нээх/хаах логик
    this.setupThemeToggle();  // light/dark theme солих логик
    this.setupSearch();       // хайлт хийх логик
    this.setupUserBtn();      // user profile товчны логик
    this.setupLogoClick();    // logo дээр дархад home руу, gradient animation
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${this.css}</style>
      <header>
        <div class="logo" role="link" tabindex="0" aria-label="Нүүр хуудас руу очих">
          <img src="./assets/images/Logo.svg" alt="Logo">
          <div class="logo-content">
            <div class="logo-main">
              <h1>Ayal<span>GO</span></h1>
            </div>
          </div>
        </div>

        <div class="header-nav">
          <a href="#/home">Нүүр Хуудас</a>
          <a href="#/spots">Аяллын Цэгүүд</a>
          <a id="header-plan" href="#/plan">Миний Төлөвлөгөө</a>

          <div class="search-container">
            <input type="text" placeholder="Хайлт хийх..">
            <button class="search-btn" type="button" aria-label="Хайх">
              <svg><use href="./styles/icons.svg#icon-search"></use></svg>
            </button>
          </div>

          <!-- Theme toggle: moon/sun icon-ийг theme-ээс хамаарч нуух/харуулах -->
          <button class="theme-toggle" type="button" aria-label="Theme солих">
            <svg class="icon-moon"><use href="./styles/icons.svg#icon-moon"></use></svg>
            <svg class="icon-sun hidden"><use href="./styles/icons.svg#icon-sun"></use></svg>
          </button>

          <!-- user profile / login товч -->
          <button class="user-btn" aria-label="Хэрэглэгчийн профайл">
            <svg><use href="./styles/icons.svg#icon-user"></use></svg>
          </button>
        </div>

        <div class="mobile-actions">
          <div class="search-container mobile-search">
            <input type="text" placeholder="Хайлт хийх..">
            <button class="search-btn" type="button" aria-label="Хайх">
              <svg><use href="./styles/icons.svg#icon-search"></use></svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu (hamburger) -->
        <button class="mobile-menu-btn" type="button" aria-label="Цэс нээх">
          <span class="menu-icon" aria-hidden="true">
            <span class="bar top"></span>
            <span class="bar bottom"></span>
          </span>
        </button>

        <!-- Mobile dropdown nav -->
        <div class="mobile-nav">
          <a href="#/home">Нүүр Хуудас</a>
          <a href="#/spots">Аяллын Цэгүүд</a>
          <a href="#/plan">Миний Төлөвлөгөө</a>
        <div class="inline-wrap">
          <div class="mobile-search-wrapper">
            <div class="search-container">
              <input type="text" placeholder="Хайлт хийх..">
              <button class="search-btn" type="button" aria-label="Хайх">
                <svg><use href="./styles/icons.svg#icon-search"></use></svg>
              </button>
            </div>
          </div>

          <div class="mobile-theme-toggle-wrapper">
            <button class="theme-toggle mobile-theme-toggle" type="button" aria-label="Өнгөний тэм солих">
              <svg class="icon-moon"><use href="./styles/icons.svg#icon-moon"></use></svg>
              <svg class="icon-sun hidden"><use href="./styles/icons.svg#icon-sun"></use></svg>
            </button>
          </div>

          <!-- user profile / login товч -->
          <button class="user-btn" aria-label="Хэрэглэгчийн профайл">
            <svg><use href="./styles/icons.svg#icon-user"></use></svg>
          </button>
        </div>
        </div>
      </header>
    `;
  }

  markActiveLink() {
    // hash өөрчлөгдөх бүр active классыг шинэчилнэ
    const update = () => {
      const currentHash = window.location.hash || "#/home";
      const links = this.shadowRoot.querySelectorAll(".header-nav a, .mobile-nav a");

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

    update(); // эхний удаа
    window.addEventListener("hashchange", update); // дараа нь hash солигдох бүр
  }

  setupMobileMenu() {
    const btn = this.shadowRoot.querySelector(".mobile-menu-btn");
    const nav = this.shadowRoot.querySelector(".mobile-nav");
    if (!btn || !nav) return;

    const setState = (isOpen) => {
      nav.classList.toggle("active", isOpen); // dropdown харагдуулах/нуух
      btn.classList.toggle("is-open", isOpen); // icon animation төлөв
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

    // mobile нав доторх линк дарвал автоматаар хаах
    const mobileLinks = this.shadowRoot.querySelectorAll(".mobile-nav a");
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => setState(false));
    });
  }

  setupThemeToggle() {
    const html = document.documentElement;
    const STORAGE_KEY = "ayalgo-theme";
    const buttons = this.shadowRoot.querySelectorAll(".theme-toggle");

    if (!buttons.length) return;

    // Эхний theme-ээ: localStorage байвал тэрийг, байхгүй бол OS preference ашиглана
    const getInitial = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    // Moon/Sun icon-ийг theme-ээс хамаарч харуулах/нуух
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

    // Theme-ээ DOM дээр болон localStorage-д хадгалж, icon-ийг шинэчилнэ
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

  setupSearch() {
    const searchContainers = Array.from(this.shadowRoot.querySelectorAll('.search-container'));

    if (!searchContainers.length) return;

    // Текстийг нэг стандартад оруулах 
    const normalizeStr = (str) => {
      if (!str) return '';
      return String(str).toLowerCase().trim();
    };

    // Map-д давхардалгүй хадгалах helper
    const addFilterValue = (map, value) => {
      if (!value) return;
      const cleaned = typeof value === 'string' ? value.trim() : value;
      const normalized = normalizeStr(cleaned);
      if (normalized && !map.has(normalized)) {
        map.set(normalized, cleaned);
      }
    };

    // activities, cate гэх мэт нь array/эсвэл string байж болох тул массив болгоно
    const toArray = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        return value.split(',').map(part => part.trim()).filter(Boolean);
      }
      return [];
    };

    // Spots доторх бүх region/cate/activities-ийн боломжит утгуудыг Map болгон цуглуулна
    const buildFilterMaps = (spots) => {
      const categoryMap = new Map();
      const regionMap = new Map();
      const activityMap = new Map();

      spots.forEach(spot => {
        addFilterValue(regionMap, spot.region);
        toArray(spot.cate).forEach(value => addFilterValue(categoryMap, value));
        toArray(spot.activities).forEach(value => addFilterValue(activityMap, value));
      });

      return { categoryMap, regionMap, activityMap };
    };

    // хэрэглэгчийн бичсэн хайлт нь category/region/activity-тай яг таарч байна уу гэдгийг шалгана
    const findFilterMatch = (normalizedQuery, maps) => {
      if (!normalizedQuery) return null;
      if (maps.categoryMap.has(normalizedQuery)) {
        return { type: 'category', value: maps.categoryMap.get(normalizedQuery) };
      }
      if (maps.regionMap.has(normalizedQuery)) {
        return { type: 'region', value: maps.regionMap.get(normalizedQuery) };
      }
      if (maps.activityMap.has(normalizedQuery)) {
        return { type: 'activity', value: maps.activityMap.get(normalizedQuery) };
      }
      return null;
    };

    const performSearch = (searchInput) => {
      const rawQuery = searchInput.value.trim();
      const normalizedQuery = normalizeStr(rawQuery);

      // хоосон бол анхааруулна
      if (!rawQuery) {
        alert('Хайлтын утга оруулна уу!');
        return;
      }

      // appState бэлэн эсэх шалгах (data source)
      if (!window.appState) {
        return;
      }

      // бүх spot-оо авч хайлт хийнэ
      const allSpots = window.appState.getAllSpots();

      // Хэрэв хэрэглэгч яг filter-ийн нэр бичсэн бол:
      const filterMaps = buildFilterMaps(allSpots);
      const filterMatch = findFilterMatch(normalizedQuery, filterMaps);

      if (filterMatch) {
        // URL query param үүсгэж spots page руу фильтертэй очно
        const params = new URLSearchParams();

        if (filterMatch.type === 'category') {
          params.set('cate', filterMatch.value);
        } else if (filterMatch.type === 'region') {
          params.set('bus', filterMatch.value);
        } else if (filterMatch.type === 'activity') {
          params.set('activity', filterMatch.value);
        }

        // өмнөх хайлтын sessionStorage-ийг цэвэрлэнэ
        sessionStorage.removeItem('searchResults');
        sessionStorage.removeItem('searchQuery');

        // фильтертэй hash руу шилжинэ
        window.location.hash = `#/spots?${params.toString()}`;
        searchInput.value = '';
        return;
      }

      // Ерөнхий хайлт: нэр/бүс/байршил/категори дотор includes хийх
      const results = allSpots.filter(spot => {
        const title = normalizeStr(spot.title);
        const region = normalizeStr(spot.region);
        const location = normalizeStr(spot.location);
        const category = normalizeStr(spot.cate);

        return (
          title.includes(normalizedQuery) ||
          region.includes(normalizedQuery) ||
          location.includes(normalizedQuery) ||
          category.includes(normalizedQuery)
        );
      });

      // олдоогүй бол анхааруулна
      if (results.length === 0) {
        alert('Хайлт олдсонгүй.');
        return;
      }

      // яг 1 ширхэг олдвол шууд тухайн spot-ийн detail page руу оруулна
      if (results.length === 1) {
        const selectedSpotId = results[0].id;
        if (typeof window.appState.setCurrentSpot === 'function') {
          window.appState.setCurrentSpot(selectedSpotId);
        }
        window.location.hash = `#/spot-info?spotId=${selectedSpotId}`;
        searchInput.value = '';
        return;
      }

      // олон үр дүн бол sessionStorage-д хадгалаад spots page дээр жагсааж харуулах
      sessionStorage.setItem('searchResults', JSON.stringify(results));
      sessionStorage.setItem('searchQuery', normalizedQuery);
      window.location.hash = '#/spots';
      searchInput.value = '';
    };

    searchContainers.forEach((container) => {
      const searchInput = container.querySelector('input');
      const searchBtn = container.querySelector('.search-btn');

      if (!searchInput || !searchBtn) return;

      // товч дарж хайх
      searchBtn.addEventListener('click', () => performSearch(searchInput));

      // Enter дарж хайх
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          performSearch(searchInput);
        }
      });
    });
  }

  setupUserBtn() {
    const userBtn = this.shadowRoot.querySelector('.user-btn');
    if (!userBtn) {
      console.error('User button not found in shadow DOM');
      return;
    }

    userBtn.addEventListener('click', (e) => {
      console.log('User button clicked');
      e.preventDefault();
      e.stopPropagation();
      // Аяллагч бүртгэлийн хуудас руу шилжих
      window.location.hash = '#/traveler-signup';
    });
  }

  setupLogoClick() {
    const logo = this.shadowRoot.querySelector('.logo');
    const logoTitle = this.shadowRoot.querySelector('.logo h1');

    if (!logo || !logoTitle) return;

    const trigger = () => {
      window.location.hash = '#/home';
      logoTitle.classList.remove('logo-gradient-anim');
      // Force reflow so animation can restart on repeated clicks
      void logoTitle.offsetWidth;
      logoTitle.classList.add('logo-gradient-anim');
    };

    logo.addEventListener('click', (e) => {
      e.preventDefault();
      trigger();
    });

    logo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger();
      }
    });

    logoTitle.addEventListener('animationend', () => {
      logoTitle.classList.remove('logo-gradient-anim');
    });
  }
}

customElements.define("ag-header", AgHeader);
