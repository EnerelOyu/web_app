class AgRouteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['number', 'title', 'description', 'image', 'map-query'];
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
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
        return this.getAttribute('image') || '';
    }

    get mapQuery() {
        return this.getAttribute('map-query') || this.title;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: grid;
                    grid-template-columns: auto auto 1fr auto;
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

                .marker-icon {
                    width: 100%;
                    height: 100%;
                    fill: var(--primary, #ff6b00);
                }

                .marker-number {
                    position: absolute;
                    top: 25%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: var(--bg-color, #fff);
                    font-weight: bold;
                    font-size: var(--fs-sm, 0.875rem);
                    font-family: 'Rubik', sans-serif;
                }

                /* Left Controls - Hidden Until Hover */
                .route-controls-left {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--gap-size-xs, 0.5rem);
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }

                :host(:hover) .route-controls-left {
                    opacity: 1;
                }

                .drag-handle {
                    background: none;
                    border: none;
                    cursor: grab;
                    padding: var(--p-xs, 0.5rem);
                    transition: opacity 0.2s;
                }

                .drag-handle svg {
                    width: 18px;
                    height: 18px;
                    fill: var(--text-color-4, #888);
                }

                .drag-handle:active {
                    cursor: grabbing;
                }

                .item-checkbox {
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }

                .checkbox-input {
                    display: none;
                }

                .checkbox-box {
                    width: 24px;
                    height: 24px;
                    border: 2px solid var(--text-color-6, #ccc);
                    border-radius: var(--br-s, 8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }

                .checkbox-box svg {
                    width: 14px;
                    height: 14px;
                    fill: var(--bg-color, #fff);
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .checkbox-input:checked + .checkbox-box {
                    background: var(--primary, #ff6b00);
                    border-color: var(--primary, #ff6b00);
                }

                .checkbox-input:checked + .checkbox-box svg {
                    opacity: 1;
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

                .image-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .image-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .image-container:hover .image-overlay {
                    opacity: 1;
                }

                .change-image-btn {
                    background: var(--bg-color, #fff);
                    color: var(--text-color-1, #333);
                    border: none;
                    padding: var(--p-xs, 0.5rem) var(--p-sm, 0.75rem);
                    border-radius: var(--br-s, 8px);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: var(--gap-size-xs, 0.25rem);
                    font-size: var(--fs-xs, 0.75rem);
                    font-family: 'NunitoSans', sans-serif;
                    transition: all 0.2s;
                }

                .change-image-btn:hover {
                    background: var(--primary, #ff6b00);
                    color: var(--bg-color, #fff);
                }

                .change-image-btn svg {
                    width: 14px;
                    height: 14px;
                    fill: currentColor;
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
                    color: var(--text-color-5, #999);
                    transition: all 0.2s ease;
                }

                .delete-btn:hover {
                    background: var(--accent-8, #fee);
                    color: var(--accent, #f44);
                }

                .delete-btn svg {
                    width: 18px;
                    height: 18px;
                    fill: currentColor;
                }

                /* Responsive */
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

                    .route-controls-left {
                        flex-direction: row;
                        justify-content: flex-start;
                        gap: var(--gap-size-m, 1rem);
                        opacity: 1;
                        grid-column: 2;
                        grid-row: 1;
                    }

                    .route-main {
                        grid-column: 2;
                        grid-row: 2;
                        grid-template-areas: "text" "image";
                        grid-template-columns: 1fr;
                        gap: var(--gap-size-s, 0.75rem);
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

            <div class="place-marker">
                <svg viewBox="0 0 384 512" class="marker-icon">
                    <path fill="currentColor" d="M192 0C86 0 0 84.4 0 188.6 0 307.9 120.2 450.9 170.4 505.4 182.2 518.2 201.8 518.2 213.6 505.4 263.8 450.9 384 307.9 384 188.6 384 84.4 298 0 192 0z"/>
                </svg>
                <span class="marker-number">${this.number}</span>
            </div>

            <div class="route-controls-left">
                <button class="drag-handle" title="Эрэмбэ солих">
                    <svg viewBox="0 0 320 512">
                        <path fill="currentColor" d="M128 40c0-22.1-17.9-40-40-40L40 0C17.9 0 0 17.9 0 40L0 88c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zm0 192c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM0 424l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 40c0-22.1-17.9-40-40-40L232 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM192 232l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 424c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48z"/>
                    </svg>
                </button>
                <label class="item-checkbox">
                    <input type="checkbox" class="checkbox-input">
                    <div class="checkbox-box">
                        <svg viewBox="0 0 448 512">
                            <path fill="currentColor" d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"/>
                        </svg>
                    </div>
                </label>
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
                        <img src="${this.image}" alt="${this.title}">
                        <div class="image-overlay">
                            <button class="change-image-btn">
                                <svg viewBox="0 0 512 512">
                                    <path fill="currentColor" d="M352.9 21.2L308 66.1 445.9 204 490.8 159.1C504.4 145.6 512 127.2 512 108s-7.6-37.6-21.2-51.1L455.1 21.2C441.6 7.6 423.2 0 404 0s-37.6 7.6-51.1 21.2zM274.1 100L58.9 315.1c-10.7 10.7-18.5 24.1-22.6 38.7L.9 481.6c-2.3 8.3 0 17.3 6.2 23.4s15.1 8.5 23.4 6.2l127.8-35.5c14.6-4.1 27.9-11.8 38.7-22.6L412 237.9 274.1 100z"/>
                                </svg>
                                Зураг солих
                            </button>
                        </div>
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
                    <svg viewBox="0 0 448 512">
                        <path fill="currentColor" d="M166.2-16c-13.3 0-25.3 8.3-30 20.8L120 48 24 48C10.7 48 0 58.7 0 72S10.7 96 24 96l400 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-96 0-16.2-43.2C307.1-7.7 295.2-16 281.8-16L166.2-16zM32 144l0 304c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-304-48 0 0 304c0 8.8-7.2 16-16 16L96 464c-8.8 0-16-7.2-16-16l0-304-48 0zm160 72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 176c0 13.3 10.7 24 24 24s24-10.7 24-24l0-176zm112 0c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 176c0 13.3 10.7 24 24 24s24-10.7 24-24l0-176z"/>
                    </svg>
                </button>
            </div>
        `;
    }

    attachEventListeners() {
        const shadow = this.shadowRoot;
        const guideData = {
            'g1': { name: 'Дорж', phone: '+976 9090 9909' },
            'g2': { name: 'Саран', phone: '+976 9900 1122' },
            'g3': { name: 'Бат', phone: '+976 8881 2233' }
        };

        // Guide selector
        const select = shadow.querySelector('.guide-select-dropdown');
        const selectedGuide = shadow.querySelector('.selected-guide');

        select?.addEventListener('change', (e) => {
            const value = e.target.value;
            if (value && guideData[value]) {
                const guide = guideData[value];
                selectedGuide.querySelector('.guide-name').textContent = guide.name;
                selectedGuide.querySelector('.guide-phone').textContent = guide.phone;
                selectedGuide.querySelector('.guide-phone').href = `tel:${guide.phone.replace(/\s/g, '')}`;
                select.style.display = 'none';
                selectedGuide.classList.add('show');
            }
        });

        shadow.querySelector('.change-guide-btn')?.addEventListener('click', () => {
            select.style.display = 'block';
            selectedGuide.classList.remove('show');
            select.value = '';
        });

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
}

customElements.define('ag-route-item', AgRouteItem);
