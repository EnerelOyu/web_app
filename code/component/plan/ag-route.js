class AgRoute extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.draggedItem = null;
        this.dropIndicator = null;
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: var(--spacing-vh-sm, 2vh) var(--spacing-vw-sm, 2vw);
                    width: 100%;
                    max-width: 100%;
                    overflow: hidden;
                }

                h2 {
                    color: var(--text-color-0, #1a1a1a);
                    margin-bottom: var(--m-md, 1.5rem);
                    font-weight: 600;
                    font-size: var(--fs-xl, 1.5rem);
                    font-family: 'Rubik', sans-serif;
                }

                /* Route Divider */
                .route-divider {
                    position: relative;
                    min-height: 40px;
                    margin: var(--m-sm, 1rem) 0;
                }

                .divider-line-horizontal {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 50%;
                    height: 2px;
                    background: repeating-linear-gradient(to right, var(--text-color-7, #ddd) 0, var(--text-color-7, #ddd) 5px, transparent 5px, transparent 10px);
                    opacity: 0.6;
                    transition: opacity 0.2s;
                }

                .divider-line-vertical {
                    position: absolute;
                    width: 2px;
                    top: 0;
                    bottom: 0;
                    background: repeating-linear-gradient(to bottom, var(--text-color-7, #ddd) 0, var(--text-color-7, #ddd) 5px, transparent 5px, transparent 10px);
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .route-divider:hover .divider-line-horizontal {
                    opacity: 1;
                }

                .route-divider:hover .divider-line-vertical {
                    opacity: 0.6;
                }

                .divider-controls {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                }

                /* Add Dropdown */
                .add-dropdown {
                    position: relative;
                    z-index: 10;
                }

                .add-block-btn {
                    background: var(--bg-color, #fff);
                    color: var(--primary, #ff6b00);
                    border: 2px solid var(--text-color-7, #ddd);
                    border-radius: var(--br-circle, 50%);
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    opacity: 0.7;
                }

                .add-block-btn svg {
                    width: 16px;
                    height: 16px;
                    fill: currentColor;
                }

                .route-divider:hover .add-block-btn {
                    opacity: 1;
                    border-color: var(--primary, #ff6b00);
                    box-shadow: 0 2px 8px rgba(255, 107, 0, 0.2);
                }

                .add-block-btn:hover {
                    background: var(--primary, #ff6b00);
                    color: var(--bg-color, #fff);
                    transform: scale(1.1);
                }

                .add-menu {
                    position: absolute;
                    top: calc(100% + 8px);
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--bg-color, #fff);
                    border-radius: var(--br-s, 8px);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                    border: 1px solid var(--text-color-8, #eee);
                    padding: var(--p-xs, 0.5rem);
                    display: none;
                    flex-direction: column;
                    gap: var(--gap-size-xs, 0.25rem);
                    min-width: 180px;
                }

                .add-menu.show {
                    display: flex;
                }

                .menu-item {
                    display: flex;
                    align-items: center;
                    gap: var(--gap-size-s, 0.75rem);
                    padding: var(--p-sm, 0.75rem);
                    background: none;
                    border: none;
                    border-radius: var(--br-s, 8px);
                    cursor: pointer;
                    transition: background 0.2s;
                    font-family: 'NunitoSans', sans-serif;
                    font-size: var(--fs-sm, 0.875rem);
                    color: var(--text-color-1, #333);
                    text-align: left;
                }

                .menu-item:hover {
                    background: var(--primary-5, rgba(255, 107, 0, 0.05));
                }

                .menu-item svg {
                    width: 16px;
                    height: 16px;
                    fill: currentColor;
                    flex-shrink: 0;
                }

                /* Route Item */
                .route-item {
                    display: grid;
                    grid-template-columns: auto 1fr auto;
                    gap: var(--gap-size-s, 0.75rem);
                    align-items: start;
                    background-color: var(--bg-color, #fff);
                    border-radius: var(--br-s, 8px);
                    padding: var(--p-md, 1rem);
                    position: relative;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    margin-bottom: var(--m-xs, 0.5rem);
                    transition: all 0.2s ease;
                }

                .route-item:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }

                .route-item[draggable="true"] {
                    cursor: grab;
                }

                .route-item[draggable="true"]:active {
                    cursor: grabbing;
                }

                .route-item.dragging {
                    opacity: 0.6;
                    background: var(--text-color-8, #f5f5f5);
                    transform: rotate(2deg);
                }

                /* Left Controls */
                .route-controls-left {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--gap-size-s, 0.75rem);
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }

                .route-item:hover .route-controls-left {
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

                /* Checkbox */
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

                /* Place Marker */
                .place-marker {
                    position: relative;
                    width: 2rem;
                    height: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
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

                /* Route Main Content */
                .route-main {
                    display: grid;
                    grid-template-areas: "text image";
                    grid-template-columns: 1fr auto;
                    gap: var(--gap-size-s, 0.75rem);
                    align-items: start;
                }

                /* Place Info */
                .place-info {
                    grid-area: text;
                    display: flex;
                    flex-direction: column;
                    gap: var(--gap-size-s, 0.75rem);
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

                .place-description textarea {
                    width: 100%;
                    min-height: 80px;
                    padding: var(--p-sm, 0.75rem);
                    border: 1px solid var(--text-color-7, #ddd);
                    border-radius: var(--br-s, 8px);
                    font-family: 'NunitoSans', sans-serif;
                    font-size: var(--fs-sm, 0.875rem);
                    color: var(--text-color-1, #333);
                    resize: vertical;
                    transition: all 0.2s;
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

                /* Travel Divider */
                .travel-divider {
                    position: relative;
                    min-height: 50px;
                    margin: var(--m-sm, 1rem) 0;
                }

                .travel-info {
                    display: flex;
                    align-items: center;
                    gap: var(--gap-size-s, 0.75rem);
                    flex: 1;
                }

                .travel-mode-btn {
                    background: var(--bg-color, #fff);
                    border: 1px solid var(--text-color-7, #ddd);
                    border-radius: var(--br-s, 8px);
                    padding: var(--p-xs, 0.5rem) var(--p-sm, 0.75rem);
                    display: flex;
                    align-items: center;
                    gap: var(--gap-size-xs, 0.25rem);
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: var(--fs-sm, 0.875rem);
                    color: var(--text-color-2, #555);
                    font-family: 'NunitoSans', sans-serif;
                }

                .travel-mode-btn:hover {
                    border-color: var(--primary, #ff6b00);
                    background: var(--primary-5, rgba(255, 107, 0, 0.05));
                }

                .travel-icon {
                    width: 18px;
                    height: 18px;
                    fill: var(--text-color-3, #666);
                }

                .travel-text {
                    color: var(--text-color-2, #555);
                    font-weight: 500;
                }

                .caret-icon {
                    width: 12px;
                    height: 12px;
                    fill: var(--text-color-4, #888);
                    margin-left: var(--p-xxs, 0.125rem);
                }

                .directions-link {
                    color: var(--text-color-3, #666);
                    font-size: var(--fs-sm, 0.875rem);
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.2s;
                }

                .directions-link:hover {
                    color: var(--primary, #ff6b00);
                    text-decoration: underline;
                }

                /* Route Actions */
                .route-actions {
                    display: flex;
                    align-items: flex-start;
                    padding: var(--p-xs, 0.5rem);
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }

                .route-item:hover .route-actions {
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
                    stroke: currentColor;
                }

                /* Drop Indicator */
                .drop-indicator {
                    height: 4px;
                    background: var(--primary, #ff6b00);
                    margin: 8px 0;
                    border-radius: 2px;
                    opacity: 0.6;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .route-item {
                        grid-template-columns: 1fr;
                        gap: var(--gap-size-s, 0.75rem);
                        padding: var(--p-sm, 0.75rem);
                    }

                    .route-controls-left {
                        flex-direction: row;
                        width: 100%;
                        justify-content: flex-start;
                        gap: var(--gap-size-m, 1rem);
                        opacity: 1;
                    }

                    .route-main {
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

                    .travel-mode-btn {
                        font-size: var(--fs-xs, 0.75rem);
                        padding: var(--p-xxs, 0.25rem) var(--p-xs, 0.5rem);
                    }

                    .travel-text {
                        font-size: var(--fs-xs, 0.75rem);
                    }
                }

                @media (max-width: 480px) {
                    :host {
                        padding: var(--p-md, 1rem);
                    }

                    .route-item {
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

            <div id="container">
                <h2>Таны аяллын маршрут</h2>
                <div id="routeContent"></div>
            </div>
        `;

        this.renderRouteItems();
    }

    renderRouteItems() {
        const container = this.shadowRoot.getElementById('routeContent');
        container.innerHTML = `
            <!-- First divider -->
            <div class="route-divider">
                <div class="divider-line-horizontal"></div>
                <div class="divider-controls">
                    <div class="divider-line-vertical"></div>
                    <div class="add-dropdown">
                        <button class="add-block-btn">
                            <svg viewBox="0 0 448 512">
                                <path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"/>
                            </svg>
                        </button>
                        <div class="add-menu">
                            <button class="menu-item" data-type="place">
                                <svg viewBox="0 0 384 512">
                                    <path fill="currentColor" d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"/>
                                </svg>
                                <span>Газар нэмэх</span>
                            </button>
                            <button class="menu-item" data-type="note">
                                <svg viewBox="0 0 448 512">
                                    <path fill="currentColor" d="M64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 213.5c0 17-6.7 33.3-18.7 45.3L322.7 461.3c-12 12-28.3 18.7-45.3 18.7L64 480z"/>
                                </svg>
                                <span>Тэмдэглэл нэмэх</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Render initial route items from slot or default
        const slot = this.querySelector('route-item');
        if (!slot) {
            // Add default items
            this.addDefaultItems();
        }
    }

    addDefaultItems() {
        const container = this.shadowRoot.getElementById('routeContent');

        const defaultItems = [
            {
                number: 1,
                title: 'Чингисийн морьт хөшөө',
                description: 'Энэ бол тухайн газрын дэлгэрэнгүй тайлбар. Анхаарах зүйлс, цагийн хуваарь, үнэ зэргийг оруулна.',
                image: '../files/spot-img/11statue1.jpg',
                mapQuery: 'Чингисийн морьт хөшөө',
                travelTime: '1 цаг 30 мин',
                travelDistance: '87 км'
            },
            {
                number: 2,
                title: 'Тэрэлжийн байгалийн цогцолборт газар',
                description: '',
                image: '../files/spot-img/14Landscape3.png',
                mapQuery: 'Тэрэлж',
                travelTime: '',
                travelDistance: ''
            }
        ];

        defaultItems.forEach((item, index) => {
            container.appendChild(this.createRouteItem(item));

            // Add travel divider between items (but not after last item)
            if (index < defaultItems.length - 1) {
                container.appendChild(this.createTravelDivider(item.travelTime, item.travelDistance));
            }
        });
    }

    createRouteItem(data) {
        const item = document.createElement('div');
        item.className = 'route-item';
        item.draggable = true;
        item.setAttribute('data-place-number', data.number);

        item.innerHTML = `
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
                <div class="place-marker">
                    <svg viewBox="0 0 384 512" class="marker-icon">
                        <path fill="currentColor" d="M192 0C86 0 0 84.4 0 188.6 0 307.9 120.2 450.9 170.4 505.4 182.2 518.2 201.8 518.2 213.6 505.4 263.8 450.9 384 307.9 384 188.6 384 84.4 298 0 192 0z"/>
                    </svg>
                    <span class="marker-number">${data.number}</span>
                </div>
            </div>

            <div class="route-main">
                <div class="place-info">
                    <div class="place-header">
                        <h3 class="place-title" contenteditable="true">${data.title}</h3>
                        <div class="place-meta">
                            <a href="https://maps.google.com/?q=${encodeURIComponent(data.mapQuery)}" target="_blank" class="map-link">
                                Газрын зураг
                            </a>
                            <span class="meta-separator">·</span>
                            <button class="details-link">Дэлгэрэнгүй</button>
                        </div>
                    </div>
                    <div class="place-description">
                        <textarea placeholder="Нээлттэй цагууд, үнэ, тэмдэглэл...">${data.description}</textarea>
                    </div>
                </div>

                <div class="place-media">
                    <div class="image-container">
                        <img src="${data.image}" alt="${data.title}">
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

        return item;
    }

    createTravelDivider(time, distance) {
        const divider = document.createElement('div');
        divider.className = 'travel-divider';

        const travelText = time && distance ? `${time} · ${distance}` : 'Зай тооцоолох...';

        divider.innerHTML = `
            <div class="divider-line-horizontal"></div>
            <div class="divider-controls">
                <div class="divider-line-vertical"></div>
                <div class="travel-info">
                    <button class="travel-mode-btn" title="Зам харах">
                        <svg viewBox="0 0 512 512" class="travel-icon">
                            <path fill="currentColor" d="M135.2 117.4l-26.1 74.6 293.8 0-26.1-74.6C372.3 104.6 360.2 96 346.6 96L165.4 96c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32l181.2 0c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2l0 192c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32-320 0 0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32L0 256c0-26.7 16.4-49.6 39.6-59.2zM128 304a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
                        </svg>
                        <span class="travel-text">${travelText}</span>
                        <svg viewBox="0 0 384 512" class="caret-icon">
                            <path fill="currentColor" d="M352 160c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-160 160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-9.2-9.2-11.9-22.9-6.9-34.9S19.1 160 32 160l320 0z"/>
                        </svg>
                    </button>
                    <a href="https://www.google.com/maps/dir/?api=1" target="_blank" class="directions-link">Чиглэл</a>
                </div>
                <div class="add-dropdown">
                    <button class="add-block-btn">
                        <svg viewBox="0 0 448 512">
                            <path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"/>
                        </svg>
                    </button>
                    <div class="add-menu">
                        <button class="menu-item" data-type="place">
                            <svg viewBox="0 0 384 512">
                                <path fill="currentColor" d="M0 188.6C0 84.4 86 0 192 0S384 84.4 384 188.6c0 119.3-120.2 262.3-170.4 316.8-11.8 12.8-31.5 12.8-43.3 0-50.2-54.5-170.4-197.5-170.4-316.8zM192 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128z"/>
                            </svg>
                            <span>Газар нэмэх</span>
                        </button>
                        <button class="menu-item" data-type="note">
                            <svg viewBox="0 0 448 512">
                                <path fill="currentColor" d="M64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 213.5c0 17-6.7 33.3-18.7 45.3L322.7 461.3c-12 12-28.3 18.7-45.3 18.7L64 480z"/>
                            </svg>
                            <span>Тэмдэглэл нэмэх</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        return divider;
    }

    attachEventListeners() {
        const shadow = this.shadowRoot;

        // Dropdown menu toggles
        shadow.addEventListener('click', (e) => {
            const addBtn = e.target.closest('.add-block-btn');
            if (addBtn) {
                e.stopPropagation();
                const dropdown = addBtn.nextElementSibling;
                const isOpen = dropdown.classList.contains('show');

                // Close all dropdowns
                shadow.querySelectorAll('.add-menu').forEach(menu => menu.classList.remove('show'));

                // Toggle current dropdown
                if (!isOpen) {
                    dropdown.classList.add('show');
                }
            }
        });

        // Close dropdowns when clicking outside
        shadow.addEventListener('click', (e) => {
            if (!e.target.closest('.add-dropdown')) {
                shadow.querySelectorAll('.add-menu').forEach(menu => menu.classList.remove('show'));
            }
        });

        // Guide selector
        const guideData = {
            'g1': { name: 'Дорж', phone: '+976 9090 9909' },
            'g2': { name: 'Саран', phone: '+976 9900 1122' },
            'g3': { name: 'Бат', phone: '+976 8881 2233' }
        };

        shadow.addEventListener('change', (e) => {
            if (e.target.classList.contains('guide-select-dropdown')) {
                const select = e.target;
                const value = select.value;

                if (value && guideData[value]) {
                    const guide = guideData[value];
                    const parent = select.parentElement;
                    const selectedGuide = parent.querySelector('.selected-guide');

                    selectedGuide.querySelector('.guide-name').textContent = guide.name;
                    selectedGuide.querySelector('.guide-phone').textContent = guide.phone;
                    selectedGuide.querySelector('.guide-phone').href = `tel:${guide.phone.replace(/\s/g, '')}`;

                    select.style.display = 'none';
                    selectedGuide.classList.add('show');
                }
            }
        });

        shadow.addEventListener('click', (e) => {
            if (e.target.classList.contains('change-guide-btn') || e.target.closest('.change-guide-btn')) {
                const btn = e.target.closest('.change-guide-btn');
                const parent = btn.closest('.guide-selector');
                const select = parent.querySelector('.guide-select-dropdown');
                const selectedGuide = parent.querySelector('.selected-guide');

                select.style.display = 'block';
                selectedGuide.classList.remove('show');
                select.value = '';
            }
        });

        // Delete button
        shadow.addEventListener('click', (e) => {
            if (e.target.closest('.delete-btn')) {
                const item = e.target.closest('.route-item');
                const nextSibling = item.nextElementSibling;

                // Remove the item
                item.remove();

                // Remove the travel divider if it exists
                if (nextSibling && nextSibling.classList.contains('travel-divider')) {
                    nextSibling.remove();
                }

                // Update numbering
                this.updateRouteNumbering();
            }
        });

        // Drag and drop
        this.initializeDragAndDrop();
    }

    initializeDragAndDrop() {
        const shadow = this.shadowRoot;

        shadow.addEventListener('dragstart', (e) => {
            const item = e.target.closest('.route-item');
            if (item) {
                this.draggedItem = item;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        shadow.addEventListener('dragend', (e) => {
            const item = e.target.closest('.route-item');
            if (item) {
                item.classList.remove('dragging');
                this.draggedItem = null;

                // Remove any drop indicators
                shadow.querySelectorAll('.drop-indicator').forEach(ind => ind.remove());
            }
        });

        shadow.addEventListener('dragover', (e) => {
            e.preventDefault();
            const item = e.target.closest('.route-item');

            if (item && this.draggedItem && this.draggedItem !== item) {
                e.dataTransfer.dropEffect = 'move';

                // Remove existing indicators
                shadow.querySelectorAll('.drop-indicator').forEach(ind => ind.remove());

                const rect = item.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;

                // Create new indicator
                if (!this.dropIndicator) {
                    this.dropIndicator = document.createElement('div');
                    this.dropIndicator.className = 'drop-indicator';
                }

                // Insert before or after based on mouse position
                if (e.clientY < midpoint) {
                    item.parentNode.insertBefore(this.dropIndicator, item);
                } else {
                    const nextElement = item.nextElementSibling;
                    if (nextElement && nextElement.classList.contains('travel-divider')) {
                        item.parentNode.insertBefore(this.dropIndicator, nextElement.nextElementSibling);
                    } else {
                        item.parentNode.insertBefore(this.dropIndicator, nextElement);
                    }
                }
            }
        });

        shadow.addEventListener('drop', (e) => {
            e.preventDefault();
            const item = e.target.closest('.route-item');

            if (item && this.draggedItem && this.draggedItem !== item) {
                const rect = item.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;

                // Get the travel divider after dragged item
                const draggedDivider = this.draggedItem.nextElementSibling;
                const isDraggedDivider = draggedDivider && draggedDivider.classList.contains('travel-divider');

                // Remove dragged item and its divider
                if (isDraggedDivider) {
                    draggedDivider.remove();
                }
                this.draggedItem.remove();

                // Insert before or after based on drop position
                if (e.clientY < midpoint) {
                    item.parentNode.insertBefore(this.draggedItem, item);
                    if (isDraggedDivider) {
                        this.draggedItem.parentNode.insertBefore(draggedDivider, this.draggedItem.nextElementSibling);
                    }
                } else {
                    const nextElement = item.nextElementSibling;
                    if (nextElement && nextElement.classList.contains('travel-divider')) {
                        item.parentNode.insertBefore(this.draggedItem, nextElement.nextElementSibling);
                        if (isDraggedDivider) {
                            this.draggedItem.parentNode.insertBefore(draggedDivider, this.draggedItem.nextElementSibling);
                        }
                    } else {
                        item.parentNode.insertBefore(this.draggedItem, nextElement);
                        if (isDraggedDivider) {
                            this.draggedItem.parentNode.insertBefore(draggedDivider, this.draggedItem.nextElementSibling);
                        }
                    }
                }

                // Update numbering
                this.updateRouteNumbering();
            }

            // Remove drop indicators
            shadow.querySelectorAll('.drop-indicator').forEach(ind => ind.remove());
            this.dropIndicator = null;
        });
    }

    updateRouteNumbering() {
        const routeItems = this.shadowRoot.querySelectorAll('.route-item');
        routeItems.forEach((item, index) => {
            const number = index + 1;
            item.setAttribute('data-place-number', number);
            const markerNumber = item.querySelector('.marker-number');
            if (markerNumber) {
                markerNumber.textContent = number;
            }
        });
    }
}

customElements.define('ag-route', AgRoute);
