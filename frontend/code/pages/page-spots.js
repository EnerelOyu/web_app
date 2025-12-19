class PageSpots extends HTMLElement {
    constructor() {
        super();
        this.css = `
            main {
                padding: 0;   
                margin: 0;      
                align-items: flex-start;  
                display: grid;
                grid-template-columns: 1fr 3fr;
                animation: fadeInPage 0.6s ease-out;
                background-color: var(--bg-color);
            }

            .filter-aside {
                position: relative;
                top: 0;
                align-self: flex-start;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                padding: var(--p-md);
                box-shadow: 1px 0 10px 2px var(--text-color-6);
                background-color: var(--bg-color);
                max-height: 100vh;
                overflow-y: auto;

                animation: slideInLeft 0.7s ease-out;
            }

            .filter-aside h2 {
                color: var(--text-color-1);
                padding-bottom: var(--p-sm);
                font-size: var(--fs-xl);
                text-transform: uppercase;
            }

            .filter-section {
                display: flex;
                flex-direction: column;
                gap: var(--gap-size-m);
            }

            /* =============== SPOT GRID SECTION =============== */

            .spot-cards-container {
                max-height: 100vh;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: var(--gap-size-s);
                padding: var(--p-md);
            }

            .spot-cards-container a:link {
                text-decoration: none;
            }

            .container-hdr {
                color: var(--text-color-1);
                font-size: var(--fs-base);
                text-align: right;
                text-transform: uppercase;
                margin: 0 0 var(--p-xs) 0;
                padding: 0;

            }

            .spots-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: var(--gap-size-m);
            }

            /* Card fade-up animation */
            .spot-card {
            opacity: 0;
            transform: translateY(15px);
            animation: cardFadeUp 0.5s ease-out forwards;
            }

            /* Жаахан stagger эффект */
            .spots-grid .spot-card:nth-child(1) { animation-delay: 0.05s; }
            .spots-grid .spot-card:nth-child(2) { animation-delay: 0.1s; }
            .spots-grid .spot-card:nth-child(3) { animation-delay: 0.15s; }
            .spots-grid .spot-card:nth-child(4) { animation-delay: 0.2s; }
            .spots-grid .spot-card:nth-child(5) { animation-delay: 0.25s; }
            .spots-grid .spot-card:nth-child(6) { animation-delay: 0.3s; }

            /* Rating UI */
            .rating {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: var(--gap-size-xs);
            }

            .readOnly-rating-stars {
            display: inline-flex;
            }

            .readOnly-rating-stars .star {
            width: var(--svg-s);
            height: var(--svg-s);
            display: block;
            color: var(--accent-1);
            }

            .rating .rating-num {
            font-family: 'NunitoSans';
            font-size: var(--fs-sm);
            color: var(--accent-1);
            }

            /* =============== LOADING SHIMMER =============== */

            @keyframes shimmer {
            0% {
                background-position: -1000px 0;
            }
            100% {
                background-position: 1000px 0;
            }
            }

            .loading {
            animation: shimmer 2s infinite;
            background: linear-gradient(
                to right,
                var(--accent-9) 0%,
                var(--accent-8) 20%,
                var(--accent-9) 40%,
                var(--accent-9) 100%
            );
            background-size: 1000px 100%;
            }

            /* =============== KEYFRAMES (page/filter/cards) =============== */

            @keyframes fadeInPage {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
            }

            @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
            }

            @keyframes cardFadeUp {
            from {
                opacity: 0;
                transform: translateY(15px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
            }

            /* =========================================================
            ===============  TABLET  ≤ 1024px ========================
            ========================================================= */

            @media (max-width: 1024px) {

            main {
                grid-template-columns: 1fr;
            }

            .filter-aside {
                position: sticky;
                top: 0;
                z-index: 20;

                flex-direction: row;
                align-items: center;
                gap: var(--gap-size-m);

                padding: var(--p-sm) var(--p-lg);
                background-color: var(--bg-color);
                box-shadow: 0 2px 10px rgba(0,0,0,0.06);
                backdrop-filter: blur(8px);
            }

            .filter-aside h2 {
                margin: 0;
                font-size: var(--fs-base);
                white-space: nowrap;
            }

            .filter-section {
                flex: 1;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                gap: var(--gap-size-s);
                overflow-x: auto;
                scrollbar-width: none;
            }

            .filter-section::-webkit-scrollbar {
                display: none;
            }

            .filter-section ag-filter {
                flex: 0 0 auto;
                min-width: max-content;
            }

            .spot-cards-container {
                height: auto;
                overflow-y: visible;
                padding: 0 var(--p-lg);
            }

            .spots-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: var(--gap-size-m);
            }

            .container-hdr {
                text-align: left;
                margin-bottom: var(--m-sm);
            }
            }

            /* =========================================================
            ==================  MOBILE  ≤ 768px ======================
            ========================================================= */

            @media (max-width: 768px) {

            .filter-aside {
                padding: var(--p-xs) var(--p-md);
                gap: var(--gap-size-s);
                flex-direction: column;
                align-items: flex-start;
            }

            .filter-aside h2 {
                font-size: var(--fs-lg);
            }

            .filter-section {
                width: 100%;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                gap: var(--gap-size-s);
                overflow-x: auto;
                padding-bottom: var(--p-xs);
                scrollbar-width: none;
            }

            .filter-section::-webkit-scrollbar {
                display: none;
            }

            .filter-section ag-filter {
                flex: 0 0 auto;
                min-width: calc(50% - var(--gap-size-s));
            }

            .spot-cards-container {
                padding: var(--p-sm) var(--p-md);
            }

            .spots-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: var(--gap-size-m);
            }

            .spot-card {
                padding: var(--p-sm);
            }

            .spot-info h3,
            .spot-card:hover .spot-info h3 {
                font-size: var(--fs-base);
            }

            .tags li {
                font-size: var(--fs-xs);
                padding: var(--p-xxs);
            }

            .rating .rating-num {
                font-size: var(--fs-xs);
            }
            }
        `;
    }

    setupToast() {
        if (!document.querySelector('ag-toast')) {
            const toast = document.createElement('ag-toast');
            document.body.appendChild(toast);
        }
        this.toast = document.querySelector('ag-toast');
    }

    connectedCallback() {
        this.activeFilters = {
            'Категори': [],
            'Бүс нутаг': [],
            'Үйл ажиллагаа': [],
            'Үнэлгээ': []
        };

        // Check for search results from header search
        this.searchResults = null;
        this.searchQuery = null;
        const storedResults = sessionStorage.getItem('searchResults');
        const storedQuery = sessionStorage.getItem('searchQuery');

        if (storedResults && storedQuery) {
            this.searchResults = JSON.parse(storedResults);
            this.searchQuery = storedQuery;
            // Clear from sessionStorage
            sessionStorage.removeItem('searchResults');
            sessionStorage.removeItem('searchQuery');
        }

        // Read URL query parameters from home search
        this.readSearchParams();

        this.render();
        this.setupToast();
        this.attachEventListeners();

        // Listen for spotData changes
        window.addEventListener('appstatechange', (e) => {
            if (e.detail.key === 'spotData') {
                this.renderContent();
                // Apply initial filters from URL or show search results
                if (this.searchResults) {
                    this.displaySearchResults();
                } else if (this.hasActiveFilters()) {
                    this.applyFilters();
                }
            }
        });

        // Initial render if data is already loaded
        if (window.appState && Object.keys(window.appState.spotData).length > 0) {
            this.renderContent();
            // Apply initial filters from URL or show search results
            if (this.searchResults) {
                this.displaySearchResults();
            } else if (this.hasActiveFilters()) {
                this.applyFilters();
            }
        }
    }

    readSearchParams() {
        const hash = window.location.hash;
        const queryIndex = hash.indexOf('?');

        if (queryIndex === -1) return;

        const queryString = hash.substring(queryIndex + 1);
        const params = new URLSearchParams(queryString);

        // Map URL params to filter names
        const area = params.get('bus');        // 'bus' -> 'Бүс нутаг'
        const category = params.get('cate');    // 'cate' -> 'Категори'
        const activity = params.get('activity'); // 'activity' -> 'Үйл ажиллагаа'

        if (area) {
            this.activeFilters['Бүс нутаг'] = [area];
        }

        if (category) {
            this.activeFilters['Категори'] = [category];
        }

        if (activity) {
            this.activeFilters['Үйл ажиллагаа'] = [activity];
        }
    }

    hasActiveFilters() {
        return Object.values(this.activeFilters).some(arr => arr.length > 0);
    }

    render() {
        this.innerHTML = `
            <style>${this.css}</style>
            <main>
            <aside class="filter-aside">
                <h2>Аяллын цэг хайх</h2>
                <section class="filter-section" id="filter-section">
                    <!-- Filters will be dynamically generated -->
                </section>
            </aside>
            <div class="spot-cards-container">
                <ag-spot-manager></ag-spot-manager>
                <p class="container-hdr">шүүсэн аяллын цэгүүд</p>
                <div class="spots-grid" id="spots-grid">
                    <!-- Spot cards will be dynamically generated -->
                </div>
            </div>
        </main>
        `;
    }

    renderContent() {
        this.generateFilters();
        this.generateSpotCards();
    }

    generateFilters() {
        const filterSection = this.querySelector('#filter-section');
        if (!filterSection) return;

        // Generate static filter HTML
        filterSection.innerHTML = `
            ${this.createFilterElement('Категори')}
            ${this.createFilterElement('Бүс нутаг')}
            ${this.createFilterElement('Үйл ажиллагаа')}
            ${this.createFilterElement('Үнэлгээ')}
        `;

        // Pre-select filters based on activeFilters after rendering
        requestAnimationFrame(() => {
            this.preselectFilters();
        });
    }

    createFilterElement(name) {
        // ag-filter component now uses static data internally
        return `<ag-filter ner="${name}"></ag-filter>`;
    }

    generateSpotCards() {
        const spotsGrid = this.querySelector('#spots-grid');
        if (!spotsGrid) return;

        const spots = window.appState.getAllSpots();
        if (!spots || spots.length === 0) return;

        // Generate spot cards HTML
        spotsGrid.innerHTML = spots.map(spot => {
            const spotId = spot.id;
            const activities = spot.activities || '';
            const age = spot.age || 'Бүх нас';
            const price = spot.price || '';

            return `
                <ag-spot-card
                    href="#/spot-info"
                    zrg="${spot.img1 || ''}"
                    bus="${spot.region || ''}"
                    unelgee="${spot.rating || '0'}"
                    ner="${spot.title || ''}"
                    cate="${spot.cate || ''}"
                    activity="${activities}"
                    une="${price}"
                    age="${age}"
                    data-spot-id="${spotId}">
                </ag-spot-card>
            `;
        }).join('');
    }

    attachEventListeners() {
        // Handle spot card clicks
        this.addEventListener('click', (e) => {
            const spotCard = e.target.closest('ag-spot-card');
            if (spotCard) {
                e.preventDefault();
                const spotId = spotCard.getAttribute('data-spot-id');
                if (spotId) {
                    window.appState.setCurrentSpot(spotId);
                    window.location.hash = '#/spot-info';
                }
            }
        });

        // Handle filter changes
        this.addEventListener('filter-changed', (e) => {
            const { type, values } = e.detail;
            this.activeFilters[type] = values;
            this.applyFilters();
        });

        this.addEventListener('plan-add-result', (e) => {
            if (!this.toast) return;
            const status = e.detail ? e.detail.status : null;
            if (status === 'added') {
                this.toast.show('Төлөвлөгөөнд нэмэгдлээ!', 'success', 3000);
            } else if (status === 'exists') {
                this.toast.show('Энэ газар аль хэдийн төлөвлөгөөнд байна', 'info', 3000);
            } else {
                this.toast.show('Төлөвлөгөөнд нэмэх үед алдаа гарлаа', 'error', 3000);
            }
        });
    }

    preselectFilters() {
        const filterSection = this.querySelector('#filter-section');
        if (!filterSection) return;

        const agFilters = filterSection.querySelectorAll('ag-filter');

        agFilters.forEach(filter => {
            const filterName = filter.getAttribute('ner');
            const activeValues = this.activeFilters[filterName] || [];

            if (activeValues.length === 0) return;

            // Access shadow DOM
            const shadowRoot = filter.shadowRoot;
            if (!shadowRoot) return;

            const checkboxes = shadowRoot.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                if (activeValues.includes(cb.value)) {
                    cb.checked = true;
                }
            });
        });
    }

    applyFilters() {
        const spots = window.appState.getAllSpots();
        if (!spots || spots.length === 0) return;

        // Filter spots based on active filters
        const filteredSpots = spots.filter(spot => {
            // Check category filter
            const categoryFilter = this.activeFilters['Категори'];
            if (categoryFilter.length > 0) {
                const spotCategories = spot.cate ? spot.cate.split(',').map(c => c.trim()) : [];
                if (!categoryFilter.some(filter => spotCategories.includes(filter))) {
                    return false;
                }
            }

            // Check area filter
            const areaFilter = this.activeFilters['Бүс нутаг'];
            if (areaFilter.length > 0) {
                if (!areaFilter.includes(spot.region)) {
                    return false;
                }
            }

            // Check activity filter
            const activityFilter = this.activeFilters['Үйл ажиллагаа'];
            if (activityFilter.length > 0) {
                const spotActivities = spot.activities ? spot.activities.split(',').map(a => a.trim()) : [];
                if (!activityFilter.some(filter => spotActivities.includes(filter))) {
                    return false;
                }
            }

            // Check rating filter
            const ratingFilter = this.activeFilters['Үнэлгээ'];
            if (ratingFilter.length > 0) {
                const spotRating = parseFloat(spot.rating) || 0;

                const matchesRating = ratingFilter.some(range => {
                    if (range === '5') {
                        return spotRating === 5;
                    } else if (range === '5-4') {
                        return spotRating >= 4 && spotRating < 5;
                    } else if (range === '4-3') {
                        return spotRating >= 3 && spotRating < 4;
                    } else if (range === '3-аас бага') {
                        return spotRating < 3;
                    }
                    return false;
                });

                if (!matchesRating) {
                    return false;
                }
            }

            return true;
        });

        // Update the spots grid with filtered results
        this.displayFilteredSpots(filteredSpots);
    }

    displayFilteredSpots(spots) {
        const spotsGrid = this.querySelector('#spots-grid');
        if (!spotsGrid) return;

        if (spots.length === 0) {
            spotsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: var(--p-xl); color: var(--text-color-3);">Шүүлтэд тохирох газар олдсонгүй.</p>';
            return;
        }

        // Generate spot cards HTML
        spotsGrid.innerHTML = spots.map(spot => {
            const spotId = spot.id;
            const activities = spot.activities || '';
            const age = spot.age || 'Бүх нас';
            const price = spot.price || '';

            return `
                <ag-spot-card
                    href="#/spot-info"
                    zrg="${spot.img1 || ''}"
                    bus="${spot.region || ''}"
                    unelgee="${spot.rating || '0'}"
                    ner="${spot.title || ''}"
                    cate="${spot.cate || ''}"
                    activity="${activities}"
                    une="${price}"
                    age="${age}"
                    data-spot-id="${spotId}">
                </ag-spot-card>
            `;
        }).join('');
    }

    displaySearchResults() {
        const spotsGrid = this.querySelector('#spots-grid');
        const containerHdr = this.querySelector('.container-hdr');

        if (!spotsGrid || !this.searchResults) return;

        // Update header to show search query
        if (containerHdr) {
            containerHdr.textContent = `"${this.searchQuery}" хайлтын үр дүн: ${this.searchResults.length} газар олдлоо`;
        }

        if (this.searchResults.length === 0) {
            spotsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: var(--p-xl); color: var(--text-color-3);">Хайлтын илэрц олдсонгүй.</p>';
            return;
        }

        // Display search results
        spotsGrid.innerHTML = this.searchResults.map(spot => {
            const spotId = spot.id;
            const activities = spot.activities || '';
            const age = spot.age || 'Бүх нас';
            const price = spot.price || '';

            return `
                <ag-spot-card
                    href="#/spot-info"
                    zrg="${spot.img1 || ''}"
                    bus="${spot.region || ''}"
                    unelgee="${spot.rating || '0'}"
                    ner="${spot.title || ''}"
                    cate="${spot.cate || ''}"
                    activity="${activities}"
                    une="${price}"
                    age="${age}"
                    data-spot-id="${spotId}">
                </ag-spot-card>
            `;
        }).join('');
    }
}

customElements.define('page-spots', PageSpots);
