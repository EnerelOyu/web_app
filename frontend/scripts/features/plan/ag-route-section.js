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
                @import url('./styles/fonts.css');

                :host {
                    display: block;
                    grid-area: route;
                    padding: var(--spacing-vh-sm, 2vh) var(--spacing-vw-sm, 2vw);
                    width: 100%;
                    max-width: 100%;
                    overflow: hidden;
                }

                h2 {
                    color: var(--text-color-0);
                    margin-bottom: var(--m-md, 1.5rem);
                    font-weight: 600;
                    font-size: var(--fs-xl, 1.5rem);
                    font-family: 'Rubik', sans-serif;
                }

                /* Route Divider */
                .route-divider {
                    position: relative;
                    min-height: var(--route-divider-min-height, 40px);
                    margin: var(--m-sm, 1rem) 0;
                }

                .divider-line-horizontal {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 50%;
                    height: var(--route-divider-line-size, 2px);
                    background: repeating-linear-gradient(to right, var(--text-color-7, #ddd) 0, var(--text-color-7, #ddd) var(--route-divider-dash, 5px), transparent var(--route-divider-dash, 5px), transparent var(--route-divider-gap, 10px));
                    opacity: 0.6;
                    transition: opacity 0.2s;
                }

                .divider-line-vertical {
                    position: absolute;
                    width: var(--route-divider-line-size, 2px);
                    top: 0;
                    bottom: 0;
                    background: repeating-linear-gradient(to bottom, var(--text-color-7, #ddd) 0, var(--text-color-7, #ddd) var(--route-divider-dash, 5px), transparent var(--route-divider-dash, 5px), transparent var(--route-divider-gap, 10px));
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
                    border: var(--route-divider-border-width, 2px) solid var(--text-color-7, #ddd);
                    border-radius: var(--br-circle, 50%);
                    width: var(--route-add-btn-size, 32px);
                    height: var(--route-add-btn-size, 32px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .add-block-btn svg {
                    width: var(--icon-size-xs, 16px);
                    height: var(--icon-size-xs, 16px);
                    fill: currentColor;
                }

                .add-block-btn:hover {
                    background: var(--primary, #ff6b00);
                    color: var(--bg-color, #fff);
                    transform: scale(1.05);
                }

                .add-label-btn {
                    background: var(--bg-color, #fff);
                    border: var(--border-width, 1px) solid var(--text-color-7, #ddd);
                    border-radius: var(--pill-radius, 999px);
                    padding: var(--route-label-padding-y, 0.35rem) var(--route-label-padding-x, 0.75rem);
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
                    border: var(--border-width, 1px) solid var(--text-color-7, #ddd);
                    border-radius: var(--br-s, 8px);
                    width: var(--route-toggle-size, 28px);
                    height: var(--route-toggle-size, 28px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: var(--text-color-4, #888);
                    transition: all 0.2s ease;
                }

                .add-toggle-btn svg {
                    width: var(--icon-size-xxs, 14px);
                    height: var(--icon-size-xxs, 14px);
                    fill: currentColor;
                }

                .add-toggle-btn:hover {
                    border-color: var(--primary, #ff6b00);
                    color: var(--primary, #ff6b00);
                }

                /* Drop Indicator */
                .drop-indicator {
                    height: var(--route-drop-indicator-height, 4px);
                    background: var(--primary, #ff6b00);
                    margin: var(--route-drop-indicator-margin, 8px) 0;
                    border-radius: var(--route-drop-indicator-radius, 2px);
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

        // Маршрутын болон тэмдэглэлийн устгах event сонсох
        this.addEventListener('delete-item', (e) => {
            const item = e.detail.item;
            const nextSibling = item.nextElementSibling;

            // Элементийг устгах
            item.remove();

            // Аялалын хуваагч байвал устгах
            if (nextSibling && nextSibling.tagName === 'AG-TRAVEL-DIVIDER') {
                nextSibling.remove();
            }

            // Дугаарлалтыг шинэчлэх
            this.updateRouteNumbering();
        });

        // Тэмдэглэл устгах event сонсох
        this.addEventListener('delete-note', (e) => {
            const item = e.detail.item;
            const nextSibling = item.nextElementSibling;

            // Элементийг устгах
            item.remove();

            // Аялалын хуваагч байвал устгах
            if (nextSibling && nextSibling.tagName === 'AG-TRAVEL-DIVIDER') {
                nextSibling.remove();
            }

            // Дугаарлалтыг шинэчлэх
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

        // Чирж байршуулах
        this.initializeDragAndDrop();

        // Slot өөрчлөлтийг ажиглах
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
        // Чирэх эхлэх - маршрут болон тэмдэглэл хоёуланг зохицуулах
        this.addEventListener('dragstart', (e) => {
            const item = e.target.closest('ag-route-item, ag-note-item');
            if (item) {
                this.draggedItem = item;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', '');
            }
        });

        // Чирэх дуусах - маршрут болон тэмдэглэл хоёуланг зохицуулах
        this.addEventListener('dragend', (e) => {
            const item = e.target.closest('ag-route-item, ag-note-item');
            if (item) {
                item.classList.remove('dragging');
                this.draggedItem = null;

                // Бүх заагчуудыг устгах
                this.querySelectorAll('.drop-indicator').forEach(ind => ind.remove());
            }
        });

        // Чирж байгаа үед - маршрут болон тэмдэглэл хоёуланг зохицуулах
        this.addEventListener('dragover', (e) => {
            e.preventDefault();
            const item = e.target.closest('ag-route-item, ag-note-item');

            if (item && this.draggedItem && this.draggedItem !== item) {
                e.dataTransfer.dropEffect = 'move';

                // Хуучин заагчуудыг устгах
                this.querySelectorAll('.drop-indicator').forEach(ind => ind.remove());

                const rect = item.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;

                // Шинэ заагч үүсгэх
                if (!this.dropIndicator) {
                    this.dropIndicator = document.createElement('div');
                    this.dropIndicator.className = 'drop-indicator';
                }

                // Хулганы байрлалаас хамааран өмнө эсвэл ард оруулах
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

        // Тавих үйлдэл - маршрут болон тэмдэглэл хоёуланг зохицуулах
        this.addEventListener('drop', (e) => {
            e.preventDefault();
            const item = e.target.closest('ag-route-item, ag-note-item');

            if (item && this.draggedItem && this.draggedItem !== item) {
                const rect = item.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;

                // Чирсэн элементийн дараах аялалын хуваагчийг авах
                const draggedDivider = this.draggedItem.nextElementSibling;
                const isDraggedDivider = draggedDivider && draggedDivider.tagName === 'AG-TRAVEL-DIVIDER';

                // Чирсэн элемент болон түүний хуваагчийг устгах
                if (isDraggedDivider) {
                    draggedDivider.remove();
                }
                this.draggedItem.remove();

                // Тавих байрлалаас хамааран өмнө эсвэл ард оруулах
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

                // Дугаарлалтыг шинэчлэх
                this.updateRouteNumbering();
                // DOM дээрх шинэ дарааллыг шууд state-д хадгална
                this.savePlanOrder();
            }

            // Заагчуудыг устгах
            this.querySelectorAll('.drop-indicator').forEach(ind => ind.remove());
            this.dropIndicator = null;
        });
    }

    updateRouteNumbering() {
        if (this.isUpdatingDividers) return;
        // Маршрутын элементүүдийн дугаарыг шинэчлэх
        const routeItems = this.querySelectorAll('ag-route-item');
        routeItems.forEach((item, index) => {
            item.setAttribute('number', index + 1);
        });

        this.updateStartDividerVisibility();

        // Аялалын хуваагчуудыг шинэчлэх - зайг дахин тооцоолох
        this.updateTravelDividers();
    }

    updateStartDividerVisibility() {
        const startDivider = this.shadowRoot?.querySelector('.route-divider--start');
        if (!startDivider) return;
        const itemCount = this.querySelectorAll('ag-route-item').length;
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

            // Хуучин хуваагчуудыг устгаж, элемент бүрийн хооронд нэг хуваагч үлдээх
            this.querySelectorAll('ag-travel-divider').forEach(divider => divider.remove());

            // Бүх элементүүдийг (маршрут) дарааллаар авах
            const allItems = Array.from(this.querySelectorAll('ag-route-item'));

            for (let i = 0; i < allItems.length; i++) {
                const currentItem = allItems[i];
                const nextItem = allItems[i + 1];

                if (nextItem) {
                    const divider = document.createElement('ag-travel-divider');
                    divider.setAttribute('time', '');
                    divider.setAttribute('distance', '');
                    currentItem.after(divider);

                    // Зай тооцоолох
                    this.calculateDistance(divider);
                } else {
                    // Сүүлийн элемент - хуваагч хэрэггүй
                }
            }
        } finally {
            this.isUpdatingDividers = false;
        }
    }

    /**
     * Маршрутын дарааллыг AppState дээр шууд шинэчилж хадгалах
     */
    savePlanOrder() {
        if (!window.appState) return;

        // Одоогийн дарааллыг хувьсагчуудад авна
        const itemsInOrder = Array.from(this.querySelectorAll('ag-route-item'));
        const planItems = window.appState.getPlanItems?.() || [];
        // AppState-д item-уудыг id-аар map болгон бэлтгэж, хадгална.
        const planById = new Map(planItems.map(item => [String(item.id), item]));

        const updatedPlanItems = [];
        let planIndex = 0;

        /* ForEach дотор spotId-г DOM-оос аван, индексийг 1-ээс өсгөж 
        (planIndex += 1) шинэ number онооно. Өмнөх item байвал spread-ээр 
        үлдсэн талбарыг авч, үгүй бол { id: spotId }-оос эхлүүлнэ.
        */
       itemsInOrder.forEach((item) => {
            const spotId = String(item.getAttribute('data-spot-id') || '');
            if (!spotId) return;
            planIndex += 1;
            const existing = planById.get(spotId) || { id: spotId };
            updatedPlanItems.push({ ...existing, number: planIndex });
        });

        window.appState.planItems = updatedPlanItems;
        window.appState.savePlanToStorage();
        window.appState.dispatchStateChange('planItems', updatedPlanItems);

        console.log('Маршрутын дараалал хадгалагдлаа:', {
            planItems: updatedPlanItems.length
        });
    }

    async calculateDistance(divider) {
        // Ачаалах төлөвт оруулах
        divider.setAttribute('time', '');
        divider.setAttribute('distance', '');

        try {
            // Өмнөх болон дараагийн маршрутын элементүүдийг авах
            const prev = divider.previousElementSibling;
            const next = divider.nextElementSibling;

            if (!prev || !next) {
                divider.setAttribute('distance', '');
                divider.setAttribute('time', '');
                return;
            }

            // Байршлын мэдээллийг авах
            const origin = prev.getAttribute('map-query') || prev.getAttribute('title');
            const destination = next.getAttribute('map-query') || next.getAttribute('title');

            if (!origin || !destination) {
                divider.setAttribute('distance', '');
                divider.setAttribute('time', '');
                return;
            }

            // Backend API дуудаж бодит зай тооцоолох
            const response = await fetch('/api/distance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ origin, destination })
            });

            const data = await response.json();

            if (data.success) {
                divider.setAttribute('distance', data.distance);
                divider.setAttribute('time', data.duration);
            } else {
                // Алдаа гарсан тохиолдолд mock өгөгдөл ашиглах
                console.warn('Distance API error:', data.error);
                const mockDistance = Math.floor(Math.random() * 150) + 20;
                const mockTime = Math.floor((mockDistance / 60) * 60);
                const hours = Math.floor(mockTime / 60);
                const minutes = mockTime % 60;

                let timeStr = '';
                if (hours > 0) {
                    timeStr = `${hours} цаг ${minutes} мин`;
                } else {
                    timeStr = `${minutes} мин`;
                }

                divider.setAttribute('distance', `~${mockDistance} км`);
                divider.setAttribute('time', timeStr);
            }
        } catch (error) {
            console.error('Error calculating distance:', error);
            // Алдаа гарсан тохиолдолд mock өгөгдөл ашиглах
            const mockDistance = Math.floor(Math.random() * 150) + 20;
            const mockTime = Math.floor((mockDistance / 60) * 60);
            const hours = Math.floor(mockTime / 60);
            const minutes = mockTime % 60;

            let timeStr = '';
            if (hours > 0) {
                timeStr = `${hours} цаг ${minutes} мин`;
            } else {
                timeStr = `${minutes} мин`;
            }

            divider.setAttribute('distance', `~${mockDistance} км`);
            divider.setAttribute('time', timeStr);
        }
    }
}

customElements.define('ag-route-section', AgRouteSection);
