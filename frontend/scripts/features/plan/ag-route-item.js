class AgRouteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['number', 'title', 'description', 'image', 'img1', 'img2', 'img3', 'map-query', 'region', 'selected-guide'];
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        // Only re-render for visual attributes, not for region/selected-guide
        if (name === 'region') {
            // Region changed, reload guides
            if (this.shadowRoot.querySelector('.guide-select-dropdown')) {
                this.loadGuidesForRegion();
            }
        } else if (name === 'selected-guide') {
            // Selected guide changed, show the guide
            if (this.shadowRoot.querySelector('.guide-select-dropdown')) {
                this.updateSelectedGuideDisplay();
            }
        } else {
            // For other attributes, re-render
            this.render();
            this.attachEventListeners();
        }
    }

    get number() {
        return this.getAttribute('number') || '1';
    }

    set number(value) {
        this.setAttribute('number', value);
    }

    get title() {
        return this.getAttribute('title') || '';
    }

    get description() {
        return this.getAttribute('description') || '';
    }

    get image() {
        return this.getAttribute('image') || this.img1 || '';
    }

    get img1() {
        return this.getAttribute('img1') || this.getAttribute('image') || '';
    }

    get img2() {
        return this.getAttribute('img2') || this.img1;
    }

    get img3() {
        return this.getAttribute('img3') || this.img1;
    }

    get images() {
        const imgs = [this.img1, this.img2, this.img3].filter(img => img);
        return imgs.length > 0 ? imgs : [this.image || ''];
    }

    get mapQuery() {
        return this.getAttribute('map-query') || this.title;
    }

    get region() {
        return this.getAttribute('region') || '';
    }

    get selectedGuide() {
        return this.getAttribute('selected-guide') || '';
    }

    set selectedGuide(value) {
        this.setAttribute('selected-guide', value);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: grid;
                    grid-template-columns: auto 1fr auto;
                    gap: var(--gap-size-m, 1rem);
                    align-items: start;
                    background-color: var(--bg-color, #fff);
                    border-radius: var(--br-s, 8px);
                    padding: var(--p-md, 1rem);
                    position: relative;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    margin-bottom: var(--m-xs, 0.5rem);
                    transition: all 0.2s ease;
                }

                :host(:hover) {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }

                :host([draggable="true"]) {
                    cursor: grab;
                }

                :host([draggable="true"]:active) {
                    cursor: grabbing;
                }

                :host(.dragging) {
                    opacity: 0.6;
                    background: var(--text-color-8, #f5f5f5);
                    transform: rotate(2deg);
                }

                /* Place Marker - Always Visible */
                .place-marker {
                    position: relative;
                    width: 2rem;
                    height: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .place-two {
                    display: flex;
                    flex-direction: column;
                }

                .marker-icon {
                    width: 100%;
                    height: 100%;
                    color: var(--primary);
                }

                .marker-number {
                    position: absolute;
                    top: 40%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: var(--bg-color, #fff);
                    font-weight: bold;
                    font-size: var(--fs-sm, 0.875rem);
                    font-family: 'Rubik', sans-serif;
                }

                .drag-handle-inline {
                    background: none;
                    border: none;
                    cursor: grab;
                    padding: var(--p-xxs, 0.25rem);
                    transition: opacity 0.2s ease;
                    opacity: 0;
                    align-self: flex-start;
                    margin-top: var(--m-xs, 0.5rem);
                }

                :host(:hover) .drag-handle-inline {
                    opacity: 1;
                }

                .drag-handle-inline svg {
                    width: 18px;
                    height: 18px;
                    color: var(--primary);
                }

                .drag-handle-inline:active {
                    cursor: grabbing;
                }

                /* Route Main */
                .route-main {
                    display: grid;
                    grid-template-areas: "text image";
                    grid-template-columns: 1fr auto;
                    gap: var(--gap-size-m, 1rem);
                    align-items: start;
                    min-width: 0;
                }

                .place-info {
                    grid-area: text;
                    display: flex;
                    flex-direction: column;
                    gap: var(--gap-size-s, 0.75rem);
                    min-width: 0;
                    overflow: visible;
                }

                .place-header {
                    display: flex;
                    flex-direction: column;
                    gap: var(--gap-size-xs, 0.25rem);
                }

                .place-title {
                    font-size: var(--fs-lg, 1.125rem);
                    font-weight: 600;
                    color: var(--text-color-0, #1a1a1a);
                    border: none;
                    background: transparent;
                    padding: var(--p-xs, 0.5rem);
                    border-radius: var(--br-s, 8px);
                    outline: none;
                    cursor: text;
                    transition: background 0.2s;
                    font-family: 'Rubik', sans-serif;
                }

                .place-title:hover,
                .place-title:focus {
                    background: var(--primary-5, rgba(255, 107, 0, 0.05));
                }

                .place-meta {
                    display: flex;
                    align-items: center;
                    gap: var(--gap-size-xs, 0.25rem);
                    font-size: var(--fs-sm, 0.875rem);
                    color: var(--text-color-3, #666);
                }

                .meta-separator {
                    color: var(--text-color-6, #ccc);
                }

                .map-link {
                    color: var(--text-color-3, #666);
                    text-decoration: none;
                    transition: color 0.2s;
                    font-weight: 500;
                }

                .map-link:hover {
                    color: var(--primary, #ff6b00);
                    text-decoration: underline;
                }

                .details-link {
                    background: none;
                    border: none;
                    color: var(--text-color-3, #666);
                    font-size: var(--fs-sm, 0.875rem);
                    font-weight: 500;
                    cursor: pointer;
                    transition: color 0.2s;
                    padding: 0;
                    font-family: 'NunitoSans', sans-serif;
                }

                .details-link:hover {
                    color: var(--primary, #ff6b00);
                    text-decoration: underline;
                }

                .place-description {
                    width: 100%;
                    min-width: 0;
                }

                .place-description textarea {
                    width: 100%;
                    min-height: 80px;
                    max-width: 100%;
                    padding: var(--p-sm, 0.75rem);
                    border: 1px solid var(--text-color-7, #ddd);
                    border-radius: var(--br-s, 8px);
                    font-family: 'NunitoSans', sans-serif;
                    font-size: var(--fs-sm, 0.875rem);
                    color: var(--text-color-1, #333);
                    resize: vertical;
                    transition: all 0.2s;
                    box-sizing: border-box;
                }

                .place-description textarea:focus {
                    outline: none;
                    border-color: var(--primary, #ff6b00);
                    background: var(--bg-color, #fff);
                }

                .place-description textarea::placeholder {
                    color: var(--text-color-5, #999);
                }

                /* Place Media */
                .place-media {
                    grid-area: image;
                    display: flex;
                    flex-direction: column;
                    gap: var(--gap-size-s, 0.75rem);
                }

                .image-container {
                    position: relative;
                    width: 200px;
                    height: 150px;
                    border-radius: var(--br-s, 8px);
                    overflow: hidden;
                }

                .image-slider {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    transition: transform 0.3s ease;
                }

                .image-slide {
                    min-width: 100%;
                    height: 100%;
                    flex-shrink: 0;
                }

                .image-slide img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    -webkit-user-drag: none;
                    user-select: none;
                }

                /* Slide Navigation */
                .slide-nav {
                    position: absolute;
                    bottom: 8px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 6px;
                    z-index: 3;
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .image-container:hover .slide-nav {
                    opacity: 1;
                }

                .slide-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                    padding: 0;
                }

                .slide-dot.active {
                    background: var(--bg-color, #fff);
                    width: 24px;
                    border-radius: 4px;
                }

                .slide-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    border-radius: var(--br-circle, 50%);
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    z-index: 3;
                    opacity: 0;
                }

                .image-container:hover .slide-arrow {
                    opacity: 1;
                }

                .slide-arrow:hover {
                    background: var(--primary, #ff6b00);
                    transform: translateY(-50%) scale(1.1);
                }

                .slide-arrow svg {
                    width: 16px;
                    height: 16px;
                    fill: var(--text-color-1, #333);
                }

                .slide-arrow:hover svg {
                    fill: var(--bg-color, #fff);
                }

                .slide-arrow.prev {
                    left: 8px;
                }

                .slide-arrow.next {
                    right: 8px;
                }

                /* Guide Selector */
                .guide-selector {
                    width: 200px;
                }

                .guide-select-dropdown {
                    width: 100%;
                    padding: var(--p-xs, 0.5rem) var(--p-sm, 0.75rem);
                    background: var(--primary-5, rgba(255, 107, 0, 0.05));
                    border: 1px solid var(--text-color-7, #ddd);
                    border-radius: var(--br-s, 8px);
                    font-family: 'NunitoSans', sans-serif;
                    font-size: var(--fs-sm, 0.875rem);
                    color: var(--text-color-2, #555);
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .guide-select-dropdown:focus {
                    outline: none;
                    border-color: var(--primary, #ff6b00);
                }

                .selected-guide {
                    display: none;
                    background: var(--primary-5, rgba(255, 107, 0, 0.05));
                    padding: var(--p-sm, 0.75rem);
                    border-radius: var(--br-s, 8px);
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--gap-size-s, 0.75rem);
                }

                .selected-guide.show {
                    display: flex;
                }

                .guide-mini-info {
                    display: flex;
                    flex-direction: column;
                    gap: var(--gap-size-xs, 0.25rem);
                }

                .guide-name {
                    font-weight: 600;
                    color: var(--text-color-1, #333);
                    font-size: var(--fs-sm, 0.875rem);
                }

                .guide-phone {
                    color: var(--text-color-3, #666);
                    font-size: var(--fs-xs, 0.75rem);
                    text-decoration: none;
                }

                .guide-phone:hover {
                    color: var(--primary, #ff6b00);
                    text-decoration: underline;
                }

                .change-guide-btn {
                    background: var(--bg-color, #fff);
                    border: 1px solid var(--text-color-7, #ddd);
                    border-radius: var(--br-s, 8px);
                    padding: var(--p-xxs, 0.25rem) var(--p-xs, 0.5rem);
                    font-size: var(--fs-xs, 0.75rem);
                    color: var(--text-color-3, #666);
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                    font-family: 'NunitoSans', sans-serif;
                }

                .change-guide-btn:hover {
                    background: var(--primary, #ff6b00);
                    color: var(--bg-color, #fff);
                    border-color: var(--primary, #ff6b00);
                }

                /* Route Actions */
                .route-actions {
                    display: flex;
                    align-items: flex-start;
                    padding: var(--p-xs, 0.5rem);
                    opacity: 0;
                    transition: opacity 0.2s ease;
                    justify-self: end;
                    align-self: start;
                }

                :host(:hover) .route-actions {
                    opacity: 1;
                }

                .delete-btn {
                    background: none;
                    border: none;
                    padding: var(--p-xs, 0.5rem);
                    border-radius: var(--br-s, 8px);
                    cursor: pointer;
                    color: var(--text-color-5);
                    transition: all 0.2s ease;
                }

                .delete-btn:hover {
                    background: var(--primary-8);
                    color: var(--primary);
                }

                .delete-btn svg {
                    width: 18px;
                    height: 18px;
                    fill: currentColor;
                    display: block;
                }

                /* Responsive */
                @media (hover: none) {
                    .route-actions {
                        opacity: 1;
                    }
                }

                @media (max-width: 768px) {
                    :host {
                        grid-template-columns: auto 1fr;
                        grid-template-rows: auto 1fr;
                        gap: var(--gap-size-s, 0.75rem);
                        padding: var(--p-sm, 0.75rem);
                    }

                    .place-marker {
                        grid-row: 1 / 3;
                        align-self: start;
                    }

                    .route-main {
                        grid-column: 2;
                        grid-row: 2;
                        grid-template-areas: "text" "image";
                        grid-template-columns: 1fr;
                        gap: var(--gap-size-s, 0.75rem);
                    }

                    .drag-handle-inline {
                        opacity: 1;
                    }

                    .image-container {
                        width: 100%;
                        height: 180px;
                    }

                    .guide-selector {
                        width: 100%;
                    }

                    .place-media {
                        width: 100%;
                    }

                    .route-actions {
                        position: absolute;
                        top: var(--p-sm, 0.75rem);
                        right: var(--p-sm, 0.75rem);
                        opacity: 1;
                    }
                }

                @media (max-width: 480px) {
                    :host {
                        padding: var(--p-xs, 0.5rem);
                    }

                    .place-title {
                        font-size: var(--fs-base, 1rem);
                    }

                    .image-container {
                        height: 150px;
                    }

                    .place-description textarea {
                        min-height: 60px;
                        font-size: var(--fs-xs, 0.75rem);
                    }
                }
            </style>

            <div class="place-two">
            <div class="place-marker">
                <svg class="marker-icon" aria-hidden="true" focusable="false">
                    <use href="/styles/icons.svg#icon-marker"></use>
                </svg>
                <span class="marker-number">${this.number}</span>
            </div>    
                <button class="drag-handle-inline" title="Эрэмбэ солих">
                    <svg aria-hidden="true" focusable="false">
                        <use href="/styles/icons.svg#icon-grip"></use>
                    </svg>
                </button>
            </div>

            <div class="route-main">
                <div class="place-info">
                    <div class="place-header">
                        <h3 class="place-title" contenteditable="true">${this.title}</h3>
                        <div class="place-meta">
                            <a href="https://maps.google.com/?q=${encodeURIComponent(this.mapQuery)}" target="_blank" class="map-link">
                                Газрын зураг
                            </a>
                            <span class="meta-separator">·</span>
                            <button class="details-link">Дэлгэрэнгүй</button>
                        </div>
                    </div>
                    <div class="place-description">
                        <textarea placeholder="Нээлттэй цагууд, үнэ, тэмдэглэл...">${this.description}</textarea>
                    </div>
                </div>

                <div class="place-media">
                    <div class="image-container">
                        <div class="image-slider">
                            ${this.images.map(img => `
                                <div class="image-slide">
                                    <img src="${img}" alt="${this.title}" draggable="false">
                                </div>
                            `).join('')}
                        </div>

                        ${this.images.length > 1 ? `
                            <button class="slide-arrow prev">
                                <svg viewBox="0 0 320 512">
                                    <path fill="currentColor" d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                                </svg>
                            </button>
                            <button class="slide-arrow next">
                                <svg viewBox="0 0 320 512">
                                    <path fill="currentColor" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
                                </svg>
                            </button>
                            <div class="slide-nav">
                                ${this.images.map((_, index) => `
                                    <button class="slide-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <div class="guide-selector">
                        <select class="guide-select-dropdown">
                            <option value="">Хөтөч сонгох...</option>
                            <option value="g1">Дорж</option>
                            <option value="g2">Саран</option>
                            <option value="g3">Бат</option>
                        </select>
                        <div class="selected-guide">
                            <div class="guide-mini-info">
                                <span class="guide-name"></span>
                                <a href="" class="guide-phone"></a>
                            </div>
                            <button class="change-guide-btn">Солих</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="route-actions">
                <button class="delete-btn" title="Устгах">
                    <svg viewBox="0 0 448 512" width="18" height="18" aria-hidden="true" focusable="false">
                        <path fill="currentColor" d="M166.2-16c-13.3 0-25.3 8.3-30 20.8L120 48 24 48C10.7 48 0 58.7 0 72S10.7 96 24 96l400 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-96 0-16.2-43.2C307.1-7.7 295.2-16 281.8-16L166.2-16zM32 144l0 304c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-304-48 0 0 304c0 8.8-7.2 16-16 16L96 464c-8.8 0-16-7.2-16-16l0-304-48 0zm160 72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 176c0 13.3 10.7 24 24 24s24-10.7 24-24l0-176zm112 0c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 176c0 13.3 10.7 24 24 24s24-10.7 24-24l0-176z"/>
                    </svg>
                </button>
            </div>
        `;
    }

    attachEventListeners() {
        const shadow = this.shadowRoot;

        // Load guides dynamically from backend
        this.loadGuidesForRegion();

        // Image Slider
        let currentSlide = 0;
        const slider = shadow.querySelector('.image-slider');
        const slides = shadow.querySelectorAll('.image-slide');
        const dots = shadow.querySelectorAll('.slide-dot');
        const prevBtn = shadow.querySelector('.slide-arrow.prev');
        const nextBtn = shadow.querySelector('.slide-arrow.next');

        const updateSlider = (index) => {
            if (!slider || slides.length === 0) return;

            currentSlide = index;
            if (currentSlide < 0) currentSlide = slides.length - 1;
            if (currentSlide >= slides.length) currentSlide = 0;

            slider.style.transform = `translateX(-${currentSlide * 100}%)`;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        };

        prevBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            updateSlider(currentSlide - 1);
        });

        nextBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            updateSlider(currentSlide + 1);
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(dot.dataset.index);
                updateSlider(index);
            });
        });

        // Guide selector - will be initialized after guides are loaded

        // Delete button
        shadow.querySelector('.delete-btn')?.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('delete-item', {
                bubbles: true,
                composed: true,
                detail: { item: this }
            }));
        });

        // Details link
        shadow.querySelector('.details-link')?.addEventListener('click', () => {
            const spotId = this.getAttribute('data-spot-id') || this.closest('[data-spot-id]')?.getAttribute('data-spot-id');
            if (spotId && window.appState?.setCurrentSpot) {
                window.appState.setCurrentSpot(spotId);
                window.location.hash = `#/spot-info?spotId=${spotId}`;
                return;
            }

            this.dispatchEvent(new CustomEvent('show-details', {
                bubbles: true,
                composed: true,
                detail: {
                    title: this.title,
                    description: this.description,
                    image: this.image
                }
            }));
        });
    }

    // Load guides for the region dynamically
    async loadGuidesForRegion() {
        const shadow = this.shadowRoot;
        const select = shadow.querySelector('.guide-select-dropdown');
        const selectedGuideDiv = shadow.querySelector('.selected-guide');

        if (!select || !this.region) return;

        // Clear existing options except placeholder
        select.innerHTML = '<option value="">Хөтөч сонгох...</option>';

        try {
            // Get guides from appState
            const allGuides = window.appState?.getAllGuides() || [];

            // If guides not loaded yet, wait for appstatechange event
            if (allGuides.length === 0) {
                select.innerHTML = '<option value="">Хөтөч ачааллаж байна...</option>';
                select.disabled = true;

                // Listen for guide data load
                const handleGuideLoad = (e) => {
                    if (e.detail.key === 'guideData') {
                        window.removeEventListener('appstatechange', handleGuideLoad);
                        this.loadGuidesForRegion();
                    }
                };
                window.addEventListener('appstatechange', handleGuideLoad);
                return;
            }

            // Filter guides by region
            const regionGuides = allGuides.filter(guide => guide.area === this.region);

            if (regionGuides.length === 0) {
                select.innerHTML = '<option value="">Энэ бүс нутагт хөтөч байхгүй</option>';
                select.disabled = true;
                return;
            }

            // Populate dropdown with filtered guides
            regionGuides.forEach(guide => {
                const option = document.createElement('option');
                option.value = guide.id;
                option.textContent = `${guide.lastName} ${guide.firstName}`;
                select.appendChild(option);
            });

            // Setup guide selector event listeners
            this.setupGuideSelector(regionGuides);

            // If there's a previously selected guide, show it
            if (this.selectedGuide) {
                const savedGuide = regionGuides.find(g => g.id === this.selectedGuide);
                if (savedGuide) {
                    this.showSelectedGuide(savedGuide);
                }
            }

        } catch (error) {
            console.error('Error loading guides:', error);
            select.innerHTML = '<option value="">Алдаа гарлаа</option>';
            select.disabled = true;
        }
    }

    // Setup guide selector event listeners
    setupGuideSelector(guides) {
        const shadow = this.shadowRoot;
        const select = shadow.querySelector('.guide-select-dropdown');
        const selectedGuideDiv = shadow.querySelector('.selected-guide');

        // Clone to remove old event listeners
        const newSelect = select.cloneNode(true);
        select.parentNode.replaceChild(newSelect, select);

        newSelect.addEventListener('change', (e) => {
            const selectedId = e.target.value;
            if (selectedId) {
                const guide = guides.find(g => g.id === selectedId);
                if (guide) {
                    this.showSelectedGuide(guide);
                    // Save selected guide
                    this.selectedGuide = guide.id;
                    this.saveSelectedGuide();
                }
            }
        });

        // Change guide button
        const changeBtn = selectedGuideDiv.querySelector('.change-guide-btn');
        if (changeBtn) {
            const newChangeBtn = changeBtn.cloneNode(true);
            changeBtn.parentNode.replaceChild(newChangeBtn, changeBtn);

            newChangeBtn.addEventListener('click', () => {
                newSelect.style.display = 'block';
                selectedGuideDiv.classList.remove('show');
                newSelect.value = '';
            });
        }
    }

    // Show selected guide info
    showSelectedGuide(guide) {
        const shadow = this.shadowRoot;
        const select = shadow.querySelector('.guide-select-dropdown');
        const selectedGuideDiv = shadow.querySelector('.selected-guide');

        selectedGuideDiv.querySelector('.guide-name').textContent = `${guide.lastName} ${guide.firstName}`;
        selectedGuideDiv.querySelector('.guide-phone').textContent = guide.phone;
        selectedGuideDiv.querySelector('.guide-phone').href = `tel:${guide.phone.replace(/\s/g, '')}`;

        select.style.display = 'none';
        selectedGuideDiv.classList.add('show');
    }

    // Save selected guide to localStorage
    saveSelectedGuide() {
        const spotId = this.closest('[data-spot-id]')?.getAttribute('data-spot-id');
        if (spotId && this.selectedGuide) {
            const savedGuides = JSON.parse(localStorage.getItem('ayalgo-selected-guides') || '{}');
            savedGuides[spotId] = this.selectedGuide;
            localStorage.setItem('ayalgo-selected-guides', JSON.stringify(savedGuides));
        }
    }

    // Update selected guide display when attribute changes
    async updateSelectedGuideDisplay() {
        if (!this.selectedGuide || !this.region) return;

        try {
            const allGuides = window.appState?.getAllGuides() || [];
            const regionGuides = allGuides.filter(guide => guide.area === this.region);
            const savedGuide = regionGuides.find(g => g.id === this.selectedGuide);

            if (savedGuide) {
                this.showSelectedGuide(savedGuide);
            }
        } catch (error) {
            console.error('Error updating selected guide display:', error);
        }
    }
}

customElements.define('ag-route-item', AgRouteItem);
