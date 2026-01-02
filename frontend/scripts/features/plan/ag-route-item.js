class AgRouteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    // observedAttributes - Хянах шинж чанаруудын жагсаалт
    static get observedAttributes() {
        return ['number', 'title', 'description', 'image', 'img1', 'img2', 'img3', 'map-query', 'region', 'selected-guide'];
    }

    connectedCallback() {
        // localStorage-аас хадгалагдсан өгөгдлийг ачаална
        this.loadSavedData();
        // Render хийх
        this.render();
        // Event listeners суулгах
        this.attachEventListeners();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        // Зөвхөн харагдах байдлын атрибутуудад дахин дүрсэлнэ
        if (name === 'region') {
            // Бүс нутаг өөрчлөгдвөл хөтчүүдийг дахин ачаална
            if (this.shadowRoot.querySelector('.guide-select-dropdown')) {
                this.loadGuidesForRegion();
            }
        } else if (name === 'selected-guide') {
            // Сонгосон хөтөч өөрчлөгдвөл харуулна
            if (this.shadowRoot.querySelector('.guide-select-dropdown')) {
                this.updateSelectedGuideDisplay();
            }
        } else {
            // Бусад атрибутуудад бүхэлд нь дахин дүрсэлнэ
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

    set description(value) {
        this.setAttribute('description', value);
    }

    set title(value) {
        this.setAttribute('title', value);
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
        const styles = `
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
                width: var(--route-marker-width, 2rem);
                height: var(--route-marker-height, 2.5rem);
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
                width: var(--icon-size-s, 18px);
                height: var(--icon-size-s, 18px);
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
                min-height: var(--route-description-min-height, 80px);
                max-width: 100%;
                padding: var(--p-sm, 0.75rem);
                border: var(--border-width, 1px) solid var(--text-color-7);
                border-radius: var(--br-s, 8px);
                font-family: 'NunitoSans', sans-serif;
                font-size: var(--fs-sm, 0.875rem);
                color: var(--text-color-1);
                resize: vertical;
                transition: all 0.2s;
                box-sizing: border-box;
            }

            .place-description textarea:focus {
                outline: none;
                border-color: var(--primary);
                background: var(--bg-color);
            }

            .place-description textarea::placeholder {
                color: var(--text-color-5);
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
                width: var(--route-image-width, 200px);
                height: var(--route-image-height, 150px);
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
                bottom: var(--slide-nav-offset, 8px);
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: var(--slide-nav-gap, 6px);
                z-index: 3;
                opacity: 0;
                transition: opacity 0.2s;
            }

            .image-container:hover .slide-nav {
                opacity: 1;
            }

            .slide-dot {
                width: var(--slide-dot-size, 8px);
                height: var(--slide-dot-size, 8px);
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                border: none;
                cursor: pointer;
                transition: all 0.2s;
                padding: 0;
            }

            .slide-dot.active {
                background: var(--bg-color, #fff);
                width: var(--slide-dot-active-width, 24px);
                border-radius: var(--slide-dot-active-radius, 4px);
            }

            .slide-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255, 255, 255, 0.9);
                border: none;
                border-radius: var(--br-circle, 50%);
                width: var(--slide-arrow-size, 32px);
                height: var(--slide-arrow-size, 32px);
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
                width: var(--icon-size-xs, 16px);
                height: var(--icon-size-xs, 16px);
                fill: var(--text-color-1, #333);
            }

            .slide-arrow:hover svg {
                fill: var(--bg-color, #fff);
            }

            .slide-arrow.prev {
                left: var(--slide-arrow-offset, 8px);
            }

            .slide-arrow.next {
                right: var(--slide-arrow-offset, 8px);
            }

            /* Guide Selector */
            .guide-selector {
                width: var(--route-guide-width, 200px);
            }

            .guide-select-dropdown {
                width: 100%;
                padding: var(--p-xs, 0.5rem) var(--p-sm, 0.75rem);
                background: var(--primary-5, rgba(255, 107, 0, 0.05));
                border: var(--border-width, 1px) solid var(--text-color-7, #ddd);
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
                cursor: pointer;
                transition: all var(--transition-fast, 0.2s) ease;
                padding: var(--p-xs, 0.25rem);
                border-radius: var(--br-s, 8px);
                margin: calc(-1 * var(--p-xs, 0.25rem));
            }

            .guide-mini-info:hover {
                background: var(--bg-color, #fff);
            }

            .guide-name {
                font-weight: 600;
                color: var(--text-color-1, #333);
                font-size: var(--fs-sm, 0.875rem);
                transition: color var(--transition-fast, 0.2s) ease;
            }

            .guide-mini-info:hover .guide-name {
                color: var(--primary, #ff6b00);
            }

            .guide-phone {
                color: var(--text-color-3, #666);
                font-size: var(--fs-xs, 0.75rem);
                text-decoration: none;
                pointer-events: none;
            }

            .change-guide-btn {
                background: var(--bg-color, #fff);
                border: var(--border-width, 1px) solid var(--text-color-7, #ddd);
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
                width: var(--icon-size-s, 18px);
                height: var(--icon-size-s, 18px);
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
                    height: var(--route-image-height-md, 180px);
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
                    min-height: var(--route-description-min-height-sm, 60px);
                    font-size: var(--fs-xs, 0.75rem);
                }
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            <div class="place-two">
            <div class="place-marker">
                <svg class="marker-icon" aria-hidden="true" focusable="false">
                    <use href="./styles/icons.svg#icon-marker"></use>
                </svg>
                <span class="marker-number">${this.number}</span>
            </div>    
                <button class="drag-handle-inline" title="Эрэмбэ солих">
                    <svg aria-hidden="true" focusable="false">
                        <use href="./styles/icons.svg#icon-grip"></use>
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
                            <button class="slide-arrow prev" aria-label="Өмнөх зураг">
                                <svg viewBox="0 0 320 512" aria-hidden="true">
                                    <path fill="currentColor" d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                                </svg>
                            </button>
                            <button class="slide-arrow next" aria-label="Дараах зураг">
                                <svg viewBox="0 0 320 512" aria-hidden="true">
                                    <path fill="currentColor" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
                                </svg>
                            </button>
                            <div class="slide-nav">
                                ${this.images.map((_, index) => `
                                    <button class="slide-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Зураг ${index + 1} руу шилжих"></button>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <div class="guide-selector">
                        <select class="guide-select-dropdown" aria-label="Хөтөч сонгох">
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

        // Бүс нутгийн хөтчүүдийг backend-ээс динамикаар ачаална
        this.loadGuidesForRegion();

        // Зургийн Slider
        let currentSlide = 0;
        const slider = shadow.querySelector('.image-slider');
        const slides = shadow.querySelectorAll('.image-slide');
        const dots = shadow.querySelectorAll('.slide-dot');
        const prevBtn = shadow.querySelector('.slide-arrow.prev');
        const nextBtn = shadow.querySelector('.slide-arrow.next');

        /**
         * updateSlider - Slider-ийг шинэчлэх (зураг солих)
         *
         * @param {number} index - Харуулах зургийн дугаар
         */
        const updateSlider = (index) => {
            if (!slider || slides.length === 0) return;

            currentSlide = index;
            // Хамгийн эхний зураг руу буцах
            if (currentSlide < 0) currentSlide = slides.length - 1;
            // Хамгийн сүүлийн зураг руу шилжих
            if (currentSlide >= slides.length) currentSlide = 0;

            // Transform ашиглан зургийг зүүн тийш шилжүүлнэ
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;

            // Цэгүүдийг идэвхтэй болгох
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        };

        // Өмнөх зураг товч
        prevBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            updateSlider(currentSlide - 1);
        });

        // Дараагийн зураг товч
        nextBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            updateSlider(currentSlide + 1);
        });

        // Цэгүүд дээр дарахад зураг солих
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(dot.dataset.index);
                updateSlider(index);
            });
        });

        // Хөтөч сонгогч - хөтчүүд ачаалагдсаны дараа эхлүүлнэ

        // Устгах товч
        shadow.querySelector('.delete-btn')?.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('delete-item', {
                bubbles: true,
                composed: true,
                detail: { item: this }
            }));
        });

        // Дэлгэрэнгүй холбоос
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

        // Газрын нэр өөрчлөх - blur үед backend болон localStorage-д хадгална
        const titleElement = shadow.querySelector('.place-title');
        if (titleElement) {
            titleElement.addEventListener('blur', async () => {
                const newTitle = titleElement.textContent.trim();
                const spotId = this.getAttribute('data-spot-id');

                if (newTitle && newTitle !== this.title) {
                    // 1. Шууд localStorage-д хадгалах
                    this.saveToLocalStorage('title', newTitle);

                    // 2. Attribute шинэчлэх
                    this.title = newTitle;

                    // 3. Backend-д хадгалах (spotId байгаа тохиолдолд)
                    if (spotId) {
                        const success = await window.appState?.updateSpotTitle(spotId, newTitle);

                        if (!success) {
                            console.warn('Backend-д title хадгалахад алдаа гарлаа, localStorage дээр хадгалагдсан');
                        }
                    }
                }
            });

            // Enter дарахад focus алдах
            titleElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    titleElement.blur();
                }
            });
        }

        // Тайлбар өөрчлөх - blur үед backend болон localStorage-д хадгална
        const descriptionElement = shadow.querySelector('.place-description textarea');
        if (descriptionElement) {
            descriptionElement.addEventListener('blur', async () => {
                const newDescription = descriptionElement.value.trim();
                const spotId = this.getAttribute('data-spot-id');

                if (newDescription !== this.description) {
                    // 1. Шууд localStorage-д хадгалах
                    this.saveToLocalStorage('description', newDescription);

                    // 2. Attribute шинэчлэх
                    this.description = newDescription;

                    // 3. Backend-д хадгалах (spotId байгаа тохиолдолд)
                    if (spotId && window.appState?.updateSpotDescription) {
                        const success = await window.appState.updateSpotDescription(spotId, newDescription);

                        if (!success) {
                            console.warn('Backend-д description хадгалахад алдаа гарлаа, localStorage дээр хадгалагдсан');
                        }
                    }
                }
            });
        }
    }

    async loadGuidesForRegion() {
        const shadow = this.shadowRoot;
        const select = shadow.querySelector('.guide-select-dropdown');
        const selectedGuideDiv = shadow.querySelector('.selected-guide');

        if (!select || !this.region) return;

        // Өмнө байсан сонголтуудыг цэвэрлэх (placeholder-ийг үлдээнэ)
        select.innerHTML = '<option value="">Хөтөч сонгох...</option>';

        try {
            // appState-ээс хөтчүүдийг авах
            const allGuides = window.appState?.getAllGuides() || [];

            // Хөтчүүд хараахан ачаалагдаагүй бол хүлээнэ
            if (allGuides.length === 0) {
                select.innerHTML = '<option value="">Хөтөч ачааллаж байна...</option>';
                select.disabled = true;

                // Хөтчүүдийн өгөгдөл ачаалагдахыг хүлээх listener
                const handleGuideLoad = (e) => {
                    if (e.detail.key === 'guideData') {
                        window.removeEventListener('appstatechange', handleGuideLoad);
                        this.loadGuidesForRegion();
                    }
                };
                window.addEventListener('appstatechange', handleGuideLoad);
                return;
            }

            // Бүс нутгаар хөтчүүдийг шүүх
            const regionGuides = allGuides.filter(guide => guide.area === this.region);

            if (regionGuides.length === 0) {
                select.innerHTML = '<option value="">Энэ бүс нутагт хөтөч байхгүй</option>';
                select.disabled = true;
                return;
            }

            // Dropdown-д шүүсэн хөтчүүдийг нэмэх
            regionGuides.forEach(guide => {
                const option = document.createElement('option');
                option.value = guide.id;
                option.textContent = `${guide.lastName} ${guide.firstName}`;
                select.appendChild(option);
            });

            // Хөтөч сонгогчийн event listener-ууд суулгах
            this.setupGuideSelector(regionGuides);

            // Өмнө сонгосон хөтөч байвал харуулах
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

    setupGuideSelector(guides) {
        const shadow = this.shadowRoot;
        const select = shadow.querySelector('.guide-select-dropdown');
        const selectedGuideDiv = shadow.querySelector('.selected-guide');

        // Хуучин event listener-ууд устгахын тулд clone хийнэ
        const newSelect = select.cloneNode(true);
        select.parentNode.replaceChild(newSelect, select);

        // Dropdown-оос хөтөч сонгох
        newSelect.addEventListener('change', (e) => {
            const selectedId = e.target.value;
            if (selectedId) {
                const guide = guides.find(g => g.id === selectedId);
                if (guide) {
                    this.showSelectedGuide(guide);
                    // Сонгосон хөтчийг хадгалах
                    this.selectedGuide = guide.id;
                    this.saveSelectedGuide();
                }
            }
        });

        // Хөтөч солих товч
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

    showSelectedGuide(guide) {
        const shadow = this.shadowRoot;
        const select = shadow.querySelector('.guide-select-dropdown');
        const selectedGuideDiv = shadow.querySelector('.selected-guide');

        // Хөтчийн нэр, утасны дугаарыг харуулах
        selectedGuideDiv.querySelector('.guide-name').textContent = `${guide.lastName} ${guide.firstName}`;
        selectedGuideDiv.querySelector('.guide-phone').textContent = guide.phone;
        selectedGuideDiv.querySelector('.guide-phone').href = `tel:${guide.phone.replace(/\s/g, '')}`;

        // Dropdown нуух, хөтчийн мэдээлэл харуулах
        select.style.display = 'none';
        selectedGuideDiv.classList.add('show');

        // Хөтчийн мэдээлэл дээр дарахад guide info хуудас руу үсрэх
        const guideInfo = selectedGuideDiv.querySelector('.guide-mini-info');
        const newGuideInfo = guideInfo.cloneNode(true);
        guideInfo.parentNode.replaceChild(newGuideInfo, guideInfo);

        newGuideInfo.addEventListener('click', (e) => {
            e.stopPropagation();
            if (guide.id) {
                window.location.hash = `#/guide-profile?g=${guide.id}`;
            }
        });
    }

    saveSelectedGuide() {
        const spotId = this.closest('[data-spot-id]')?.getAttribute('data-spot-id');
        if (spotId && this.selectedGuide) {
            const savedGuides = JSON.parse(localStorage.getItem('ayalgo-selected-guides') || '{}');
            savedGuides[spotId] = this.selectedGuide;
            localStorage.setItem('ayalgo-selected-guides', JSON.stringify(savedGuides));
        }
    }

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

    /**
     * localStorage-д routeItem-ийн өгөгдөл хадгалах
     * @param {string} field - Хадгалах талбар (title, description гэх мэт)
     * @param {string} value - Хадгалах утга
     */
    saveToLocalStorage(field, value) {
        try {
            const spotId = this.getAttribute('data-spot-id');
            if (!spotId) {
                console.warn('data-spot-id байхгүй байна, localStorage-д хадгалах боломжгүй');
                return;
            }

            // Бүх route items-ийн өгөгдлийг авах
            const storageKey = 'ayalgo-route-items-data';
            const allData = JSON.parse(localStorage.getItem(storageKey) || '{}');

            // Тухайн spot-ийн өгөгдлийг шинэчлэх
            if (!allData[spotId]) {
                allData[spotId] = {};
            }
            allData[spotId][field] = value;
            allData[spotId].lastModified = new Date().toISOString();

            // localStorage-д хадгалах
            localStorage.setItem(storageKey, JSON.stringify(allData));
        } catch (error) {
            console.error('localStorage-д хадгалахад алдаа гарлаа:', error);
        }
    }

    /**
     * localStorage-аас routeItem-ийн өгөгдөл ачаалах
     * @param {string} field - Ачаалах талбар
     * @returns {string|null} - Хадгалагдсан утга эсвэл null
     */
    loadFromLocalStorage(field) {
        try {
            const spotId = this.getAttribute('data-spot-id');
            if (!spotId) return null;

            const storageKey = 'ayalgo-route-items-data';
            const allData = JSON.parse(localStorage.getItem(storageKey) || '{}');

            return allData[spotId]?.[field] || null;
        } catch (error) {
            console.error('localStorage-аас ачаалахад алдаа гарлаа:', error);
            return null;
        }
    }

    /**
     * Component render хийхийн өмнө localStorage-аас өгөгдөл ачаалж attribute-уудыг шинэчлэх
     */
    loadSavedData() {
        const savedTitle = this.loadFromLocalStorage('title');
        const savedDescription = this.loadFromLocalStorage('description');

        // localStorage дээр хадгалагдсан утга байвал attribute шинэчлэх
        if (savedTitle && savedTitle !== this.title) {
            this.title = savedTitle;
        }

        if (savedDescription && savedDescription !== this.description) {
            this.description = savedDescription;
        }
    }
}

customElements.define('ag-route-item', AgRouteItem);
