class AgHeader extends HTMLElement {
  constructor() {
    super();
    this.css = `
      @import url('./styles/global.css');
        @import url('/styles/fonts.css');

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

      /* === LOGO хэсэг === */
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

      /* "GO" хэсгийг primary өнгөөр тодруулж байна */
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

      .search-btn svg, .user-btn svg{
        width: var(--svg-s);
        height: var(--svg-s);
        transition: 0.3s;
        color: var(--primary);
      }

      /* search hover үед background өнгө солигдож, icon эргэнэ */
      .search-btn:hover{
        background-color: var(--primary);
      }

      .search-btn:hover svg {
        color: var(--primary-5);
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
        margin-left: var(--m-xs);
      }

      .mobile-menu-btn svg {
        width: var(--svg-m);
        height: var(--svg-m);
        color: var(--primary);
      }

      /* MOBILE NAV (dropdown) */
      .mobile-nav {
        display: none;
        position: absolute;
        top: 100%;  /* header-ийн доор гарна */
        left: 0;
        right: 0;
        background-color: var(--hdr-bg-color);
        padding: var(--p-lg);
      }

      /* active үед л харагдана */
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

      /* mobile дээр theme toggle-ийг dropdown дотор тусад нь харуулах wrapper */
      .mobile-theme-toggle-wrapper {
        display: none;
        justify-content: center;
        margin-top: var(--m-sm);
      }

      /* === RESPONSIVE BREAKPOINTS === */
      @media (max-width: 780px) {
        .header-nav { display: none; }           /* desktop nav-ийг нуух */
        .mobile-menu-btn { display: block; }     /* hamburger show */
        .mobile-theme-toggle-wrapper { display: flex; }
      }

      @media (max-width: 480px) {
        .logo-content { display: none; }         /* жижиг дэлгэц дээр текстээ нуух */
        .logo h1 { font-size: var(--fs-base); }
        .logo { margin-right: var(--m-md); }     /* logo болон mobile menu хоорондох зай */
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
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${this.css}</style>
      <header>
        <div class="logo">
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
          <a href="#/plan">Миний Төлөвлөгөө</a>

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

        <!-- Mobile menu (hamburger) -->
        <button class="mobile-menu-btn" type="button" aria-label="Цэс нээх">
          <svg><use href="./styles/icons.svg#icon-menu"></use></svg>
        </button>

        <!-- Mobile dropdown nav -->
        <div class="mobile-nav">
          <a href="#/home">Нүүр Хуудас</a>
          <a href="#/spots">Аяллын Цэгүүд</a>
          <a href="#/plan">Миний Төлөвлөгөө</a>

          <div class="mobile-theme-toggle-wrapper">
            <button class="theme-toggle mobile-theme-toggle" type="button" aria-label="Өнгөний тэм солих">
              <svg class="icon-moon"><use href="./styles/icons.svg#icon-moon"></use></svg>
              <svg class="icon-sun hidden"><use href="./styles/icons.svg#icon-sun"></use></svg>
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
    const useEl = btn.querySelector("use");

    const MENU_ICON = "./styles/icons.svg#icon-menu";
    const CLOSE_ICON = "./styles/icons.svg#icon-close";

    if (!btn || !nav || !useEl) return;

    const setState = (isOpen) => {
      nav.classList.toggle("active", isOpen); // dropdown харагдуулах/нуух
      useEl.setAttribute("href", isOpen ? CLOSE_ICON : MENU_ICON); // icon солих
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
    const searchInput = this.shadowRoot.querySelector('.search-container input');
    const searchBtn = this.shadowRoot.querySelector('.search-btn');

    if (!searchInput || !searchBtn) return;

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

    const performSearch = () => {
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

    // товч дарж хайх
    searchBtn.addEventListener('click', performSearch);

    // Enter дарж хайх
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }

  setupUserBtn() {
    const userBtn = this.shadowRoot.querySelector('.user-btn');
    if (!userBtn) return;

    userBtn.addEventListener('click', () => {
      // Аяллагч бүртгэлийн хуудас руу шилжих
      window.location.hash = '#/traveler-signup';
    });
  }
}

customElements.define("ag-header", AgHeader);
