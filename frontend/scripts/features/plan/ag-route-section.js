class AgRouteSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.draggedItem = null;
        this.dropIndicator = null;
        this.isUpdatingDividers = false;
        this.pendingRouteUpdate = false;
        this.suppressSlotChange = false;
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('/styles/fonts.css');

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

                /* Add Control */
                .add-control {
                    display: flex;
                    align-items: center;
                    gap: var(--gap-size-xs, 0.5rem);
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s ease;
                    z-index: 2;
                }

                .route-divider:hover .add-control {
                    opacity: 1;
                    pointer-events: auto;
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
                }

                .add-block-btn svg {
                    width: 16px;
                    height: 16px;
                    fill: currentColor;
                }

                .add-block-btn:hover {
                    background: var(--primary, #ff6b00);
                    color: var(--bg-color, #fff);
                    transform: scale(1.05);
                }

                .add-label-btn {
                    background: var(--bg-color, #fff);
                    border: 1px solid var(--text-color-7, #ddd);
                    border-radius: 999px;
                    padding: 0.35rem 0.75rem;
                    font-family: 'NunitoSans', sans-serif;
                    font-size: var(--fs-sm, 0.875rem);
                    color: var(--text-color-2, #555);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .add-label-btn:hover {
                    border-color: var(--primary, #ff6b00);
                    color: var(--primary, #ff6b00);
                }

                .add-toggle-btn {
                    background: var(--bg-color, #fff);
                    border: 1px solid var(--text-color-7, #ddd);
                    border-radius: var(--br-s, 8px);
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: var(--text-color-4, #888);
                    transition: all 0.2s ease;
                }

                .add-toggle-btn svg {
                    width: 14px;
                    height: 14px;
                    fill: currentColor;
                }

                .add-toggle-btn:hover {
                    border-color: var(--primary, #ff6b00);
                    color: var(--primary, #ff6b00);
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

                <!-- Start divider (shown only when empty) -->
                <div class="route-divider route-divider--start" data-add-type="place">
                    <div class="divider-line-horizontal"></div>
                    <div class="divider-controls">
                        <div class="divider-line-vertical"></div>
                        <div class="add-control">
                            <button class="add-block-btn" data-action="add" aria-label="Газар нэмэх">
                                <svg viewBox="0 0 448 512" aria-hidden="true">
                                    <path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"/>
                                </svg>
                            </button>
                            <button class="add-label-btn" data-action="add">Газар нэмэх</button>
                            <button class="add-toggle-btn" data-action="toggle" aria-label="Нэмэх төрлийг солих">
                                <svg viewBox="0 0 512 512" aria-hidden="true">
                                    <path fill="currentColor" d="M304 48c0-26.5 21.5-48 48-48l80 0c26.5 0 48 21.5 48 48l0 80c0 26.5-21.5 48-48 48-16.9 0-31.7-8.7-40.1-21.9l-82.7 82.7c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l82.7-82.7C312.7 79.7 304 64.9 304 48zM208 464c0 26.5-21.5 48-48 48l-80 0c-26.5 0-48-21.5-48-48l0-80c0-26.5 21.5-48 48-48 16.9 0 31.7 8.7 40.1 21.9l82.7-82.7c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-82.7 82.7c12.7 8.4 21.9 23.2 21.9 40.1l0 80z"/>
                                </svg>
                            </button>
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

        // Listen for delete events from route items and note items
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

        // Listen for delete events from note items
        this.addEventListener('delete-note', (e) => {
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

        const setDividerType = (divider, type) => {
            if (!divider) return;
            divider.dataset.addType = type;
            const labelBtn = divider.querySelector('.add-label-btn');
            const addBtn = divider.querySelector('.add-block-btn');
            if (labelBtn) {
                labelBtn.textContent = type === 'note' ? 'Тэмдэглэл нэмэх' : 'Газар нэмэх';
            }
            if (addBtn) {
                addBtn.setAttribute('aria-label', type === 'note' ? 'Тэмдэглэл нэмэх' : 'Газар нэмэх');
            }
        };

        shadow.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('[data-action]');
            if (!actionBtn) return;

            const divider = e.target.closest('.route-divider');
            if (!divider) return;

            const action = actionBtn.dataset.action;
            const currentType = divider.dataset.addType || 'place';

            if (action === 'toggle') {
                const nextType = currentType === 'place' ? 'note' : 'place';
                setDividerType(divider, nextType);
                return;
            }

            this.dispatchEvent(new CustomEvent('add-item', {
                bubbles: true,
                composed: true,
                detail: { type: currentType, divider }
            }));
        });

        // Drag and drop
        this.initializeDragAndDrop();

        // Observe slot changes
        const slot = shadow.querySelector('slot');
        slot?.addEventListener('slotchange', () => {
            if (this.suppressSlotChange) return;
            this.scheduleRouteUpdate();
        });
    }

    scheduleRouteUpdate() {
        if (this.pendingRouteUpdate || this.isUpdatingDividers) return;
        this.pendingRouteUpdate = true;
        requestAnimationFrame(() => {
            this.pendingRouteUpdate = false;
            if (this.isUpdatingDividers) return;
            this.updateRouteNumbering();
        });
    }

    initializeDragAndDrop() {
        // Drag start - handle both route-item and note-item
        this.addEventListener('dragstart', (e) => {
            const item = e.target.closest('ag-route-item, ag-note-item');
            if (item) {
                this.draggedItem = item;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', '');
            }
        });

        // Drag end - handle both route-item and note-item
        this.addEventListener('dragend', (e) => {
            const item = e.target.closest('ag-route-item, ag-note-item');
            if (item) {
                item.classList.remove('dragging');
                this.draggedItem = null;

                // Remove any drop indicators
                this.querySelectorAll('.drop-indicator').forEach(ind => ind.remove());
            }
        });

        // Drag over - handle both route-item and note-item
        this.addEventListener('dragover', (e) => {
            e.preventDefault();
            const item = e.target.closest('ag-route-item, ag-note-item');

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

        // Drop - handle both route-item and note-item
        this.addEventListener('drop', (e) => {
            e.preventDefault();
            const item = e.target.closest('ag-route-item, ag-note-item');

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
        if (this.isUpdatingDividers) return;
        // Update route-item numbers
        const routeItems = this.querySelectorAll('ag-route-item');
        routeItems.forEach((item, index) => {
            item.setAttribute('number', index + 1);
        });

        // Update note-item numbers
        const noteItems = this.querySelectorAll('ag-note-item');
        noteItems.forEach((item, index) => {
            item.setAttribute('number', index + 1);
        });

        this.updateStartDividerVisibility();

        // Update travel dividers - recalculate distances
        this.updateTravelDividers();
    }

    updateStartDividerVisibility() {
        const startDivider = this.shadowRoot?.querySelector('.route-divider--start');
        if (!startDivider) return;
        const itemCount = this.querySelectorAll('ag-route-item, ag-note-item').length;
        if (itemCount === 0) {
            startDivider.removeAttribute('hidden');
        } else {
            startDivider.setAttribute('hidden', '');
        }
    }

    async updateTravelDividers() {
        if (this.isUpdatingDividers) return;
        this.isUpdatingDividers = true;

        try {
            this.suppressSlotChange = true;
            requestAnimationFrame(() => {
                this.suppressSlotChange = false;
            });

            // Ensure a single divider between items by resetting existing ones
            this.querySelectorAll('ag-travel-divider').forEach(divider => divider.remove());

            // Get all items (both route-items and note-items) in order
            const allItems = Array.from(this.querySelectorAll('ag-route-item, ag-note-item'));

            for (let i = 0; i < allItems.length; i++) {
                const currentItem = allItems[i];
                const nextItem = allItems[i + 1];

                if (nextItem) {
                    const divider = document.createElement('ag-travel-divider');
                    divider.setAttribute('time', '');
                    divider.setAttribute('distance', '');
                    currentItem.after(divider);
                } else {
                    // Last item - no divider
                }
            }
        } finally {
            this.isUpdatingDividers = false;
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

customElements.define('ag-route-section', AgRouteSection);
