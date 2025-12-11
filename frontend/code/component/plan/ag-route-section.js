class AgRouteSection extends HTMLElement {
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
                    grid-area: route;
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

                /* Drop Indicator */
                .drop-indicator {
                    height: 4px;
                    background: var(--primary, #ff6b00);
                    margin: 8px 0;
                    border-radius: 2px;
                    opacity: 0.6;
                }

                /* Responsive */
                @media (max-width: 480px) {
                    :host {
                        padding: var(--p-md, 1rem);
                    }
                }
            </style>

            <div id="container">
                <h2>Таны аяллын маршрут</h2>

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

                <div id="routeContent">
                    <slot></slot>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const shadow = this.shadowRoot;

        // Listen for delete events from route items
        this.addEventListener('delete-item', (e) => {
            const item = e.detail.item;
            const nextSibling = item.nextElementSibling;

            // Remove the item
            item.remove();

            // Remove the travel divider if it exists
            if (nextSibling && nextSibling.tagName === 'AG-TRAVEL-DIVIDER') {
                nextSibling.remove();
            }

            // Update numbering
            this.updateRouteNumbering();
        });

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

        // Menu item clicks
        shadow.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (menuItem) {
                const type = menuItem.dataset.type;
                this.dispatchEvent(new CustomEvent('add-item', {
                    bubbles: true,
                    composed: true,
                    detail: { type }
                }));
            }
        });

        // Drag and drop
        this.initializeDragAndDrop();

        // Observe slot changes
        const slot = shadow.querySelector('slot');
        slot?.addEventListener('slotchange', () => {
            this.updateRouteNumbering();
        });
    }

    initializeDragAndDrop() {
        // Drag start
        this.addEventListener('dragstart', (e) => {
            const item = e.target.closest('ag-route-item');
            if (item) {
                this.draggedItem = item;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        // Drag end
        this.addEventListener('dragend', (e) => {
            const item = e.target.closest('ag-route-item');
            if (item) {
                item.classList.remove('dragging');
                this.draggedItem = null;

                // Remove any drop indicators
                this.querySelectorAll('.drop-indicator').forEach(ind => ind.remove());
            }
        });

        // Drag over
        this.addEventListener('dragover', (e) => {
            e.preventDefault();
            const item = e.target.closest('ag-route-item');

            if (item && this.draggedItem && this.draggedItem !== item) {
                e.dataTransfer.dropEffect = 'move';

                // Remove existing indicators
                this.querySelectorAll('.drop-indicator').forEach(ind => ind.remove());

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
                    if (nextElement && nextElement.tagName === 'AG-TRAVEL-DIVIDER') {
                        item.parentNode.insertBefore(this.dropIndicator, nextElement.nextElementSibling);
                    } else {
                        item.parentNode.insertBefore(this.dropIndicator, nextElement);
                    }
                }
            }
        });

        // Drop
        this.addEventListener('drop', (e) => {
            e.preventDefault();
            const item = e.target.closest('ag-route-item');

            if (item && this.draggedItem && this.draggedItem !== item) {
                const rect = item.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;

                // Get the travel divider after dragged item
                const draggedDivider = this.draggedItem.nextElementSibling;
                const isDraggedDivider = draggedDivider && draggedDivider.tagName === 'AG-TRAVEL-DIVIDER';

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
                    if (nextElement && nextElement.tagName === 'AG-TRAVEL-DIVIDER') {
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
            this.querySelectorAll('.drop-indicator').forEach(ind => ind.remove());
            this.dropIndicator = null;
        });
    }

    updateRouteNumbering() {
        const routeItems = this.querySelectorAll('ag-route-item');
        routeItems.forEach((item, index) => {
            item.setAttribute('number', index + 1);
        });

        // Update travel dividers - recalculate distances
        this.updateTravelDividers();
    }

    async updateTravelDividers() {
        const routeItems = Array.from(this.querySelectorAll('ag-route-item'));

        for (let i = 0; i < routeItems.length; i++) {
            const currentItem = routeItems[i];
            const nextItem = routeItems[i + 1];

            // Get or create divider between current and next item
            let divider = currentItem.nextElementSibling;

            if (nextItem) {
                // There should be a divider
                if (!divider || divider.tagName !== 'AG-TRAVEL-DIVIDER') {
                    // Create new divider
                    divider = document.createElement('ag-travel-divider');
                    currentItem.after(divider);
                }

                // Calculate distance between items
                await this.calculateDistance(divider);
            } else {
                // Last item - remove divider if exists
                if (divider && divider.tagName === 'AG-TRAVEL-DIVIDER') {
                    divider.remove();
                }
            }
        }
    }

    async calculateDistance(divider) {
        // Set loading state
        divider.setAttribute('time', '');
        divider.setAttribute('distance', '');

        try {
            // Simple mock calculation - replace with real Google Maps API
            const mockDistance = Math.floor(Math.random() * 150) + 20; // 20-170 km
            const mockTime = Math.floor((mockDistance / 60) * 60); // Average 60km/h
            const hours = Math.floor(mockTime / 60);
            const minutes = mockTime % 60;

            let timeStr = '';
            if (hours > 0) {
                timeStr = `${hours} цаг ${minutes} мин`;
            } else {
                timeStr = `${minutes} мин`;
            }

            divider.setAttribute('distance', `${mockDistance} км`);
            divider.setAttribute('time', timeStr);

            // TODO: Replace with real Google Maps API call
            // Get previous and next route items to calculate real distance
            // const prev = divider.previousElementSibling;
            // const next = divider.nextElementSibling;
            // const origin = prev.getAttribute('map-query') || prev.getAttribute('title');
            // const destination = next.getAttribute('map-query') || next.getAttribute('title');
            // const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=YOUR_API_KEY`);
            // const data = await response.json();
            // Parse and set real distance and time
        } catch (error) {
            console.error('Error calculating distance:', error);
            divider.setAttribute('distance', 'Тооцоолох боломжгүй');
            divider.setAttribute('time', '');
        }
    }
}

// Travel Divider Component
class AgTravelDivider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['time', 'distance'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    get time() {
        return this.getAttribute('time') || '';
    }

    get distance() {
        return this.getAttribute('distance') || '';
    }

    get travelText() {
        if (this.time && this.distance) {
            return `${this.time} · ${this.distance}`;
        }
        return 'Тооцоолж байна...';
    }

    get isEmpty() {
        return !this.time && !this.distance;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                    min-height: 50px;
                    margin: var(--m-sm, 1rem) 0;
                }

                :host([hidden]) {
                    display: none;
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

                :host(:hover) .divider-line-horizontal {
                    opacity: 1;
                }

                :host(:hover) .divider-line-vertical {
                    opacity: 0.6;
                }

                .divider-controls {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
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

                @media (max-width: 768px) {
                    .travel-mode-btn {
                        font-size: var(--fs-xs, 0.75rem);
                        padding: var(--p-xxs, 0.25rem) var(--p-xs, 0.5rem);
                    }

                    .travel-text {
                        font-size: var(--fs-xs, 0.75rem);
                    }
                }
            </style>

            <div class="divider-line-horizontal"></div>
            <div class="divider-controls">
                <div class="divider-line-vertical"></div>
                <div class="travel-info">
                    <button class="travel-mode-btn" title="Зам харах">
                        <svg viewBox="0 0 512 512" class="travel-icon">
                            <path fill="currentColor" d="M135.2 117.4l-26.1 74.6 293.8 0-26.1-74.6C372.3 104.6 360.2 96 346.6 96L165.4 96c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32l181.2 0c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2l0 192c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32-320 0 0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32L0 256c0-26.7 16.4-49.6 39.6-59.2zM128 304a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
                        </svg>
                        <span class="travel-text">${this.travelText}</span>
                        <svg viewBox="0 0 384 512" class="caret-icon">
                            <path fill="currentColor" d="M352 160c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-160 160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-9.2-9.2-11.9-22.9-6.9-34.9S19.1 160 32 160l320 0z"/>
                        </svg>
                    </button>
                    <a href="https://www.google.com/maps/dir/?api=1" target="_blank" class="directions-link">Чиглэл</a>
                </div>
            </div>
        `;
    }
}

customElements.define('ag-route-section', AgRouteSection);
customElements.define('ag-travel-divider', AgTravelDivider);
