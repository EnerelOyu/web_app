class PagePlan extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();

        // Listen for state changes
        window.addEventListener('appstatechange', (e) => {
            if (e.detail.key === 'planItems') {
                this.updatePlanItems();
            }
        });
    }

    render() {
        this.innerHTML = `
            <section id="plan-section" class="plan-section">
                <div class="plan-title">
                    <div>
                        <h1>Миний төлөвлөгөө</h1>
                        <ag-share-button></ag-share-button>
                    </div>
                </div>

                <div class="suggestion">
                    <h3>Танд санал болгох аяллын цэгүүд</h3>
                    <a href="#/spots" class="more-spots">
                        <p>Бүгдийг харах</p>
                        <svg class="more-icon">
                            <use href="../styles/icons.svg#icon-arrow"></use>
                        </svg>
                    </a>
                    <div class="TL">
                        <ag-spot-card
                            zrg="https://lp-cms-production.imgix.net/2023-07/shutterstockRF1229637994.jpg"
                            bus="төв"
                            unelgee="4.5"
                            ner="Цонжин Болдог"
                            cate="Соёл"
                            activity="Морин аялал, Амьтантай ойр"
                            une="20,000"
                            age="Бүх нас"
                            data-spot-id="tsonjin">
                        </ag-spot-card>
                        <ag-spot-card
                            zrg="https://lp-cms-production.imgix.net/2019-06/73598f88ed537774c53235a248ac9feb-gandan-khiid.jpg"
                            bus="төв"
                            unelgee="4.5"
                            ner="Гандан Тэгчинлэн Хийд"
                            cate="Соёл"
                            activity="Түүхэн"
                            une="50,000"
                            age="Бүх нас"
                            data-spot-id="gandan">
                        </ag-spot-card>
                    </div>
                </div>

                <ag-route-section id="route-section">
                    <!-- Route items will be rendered here -->
                </ag-route-section>
            </section>
        `;

        // Initial render of plan items
        this.updatePlanItems();
    }

    updatePlanItems() {
        const routeSection = this.querySelector('#route-section');
        if (!routeSection) return;

        const planItems = window.appState.getPlanItems();

        // Clear existing items
        routeSection.innerHTML = '';

        // Render each plan item
        planItems.forEach((item, index) => {
            // Add travel divider if not first item
            if (index > 0) {
                const divider = document.createElement('ag-travel-divider');
                divider.setAttribute('time', '1 цаг 30 мин');
                divider.setAttribute('distance', '87 км');
                routeSection.appendChild(divider);
            }

            // Create route item
            const routeItem = document.createElement('ag-route-item');
            routeItem.setAttribute('number', item.number);
            routeItem.setAttribute('title', item.title);
            routeItem.setAttribute('description', item.description || '');
            routeItem.setAttribute('image', item.img1);
            routeItem.setAttribute('map-query', item.title);
            routeItem.setAttribute('draggable', 'true');
            routeItem.setAttribute('data-spot-id', item.id);

            routeSection.appendChild(routeItem);
        });
    }

    attachEventListeners() {
        // Handle suggested spot clicks
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

        // Handle route item delete
        this.addEventListener('delete-item', (e) => {
            const item = e.detail.item;
            const spotId = item.getAttribute('data-spot-id');
            if (spotId) {
                window.appState.removeFromPlan(spotId);
            }
        });
    }
}

customElements.define('page-plan', PagePlan);
