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
            <style>
                /* Page Plan Container */
                :host {
                    display: block;
                    width: 100%;
                }

                .main-container {
                    display: grid;
                    grid-template:
                        "plan-title"
                        "route"
                        "suggestion" / 1fr;
                    min-height: calc(100vh - var(--header-height) - var(--footer-height));
                    margin: 0 auto;
                    max-width: 1200px;
                    width: 100%;
                    row-gap: var(--gap-size-xl);
                    padding: var(--p-xl) var(--p-md);
                }

                /* Plan Title Section */
                .plan-title {
                    grid-area: plan-title;
                    display: grid;
                    grid-template: "h1" "btn" / 1fr;
                    justify-items: center;
                    align-items: center;
                    background: url("../files/spot-img/14Landscape3.png") no-repeat center / cover;
                    width: 100%;
                    padding: var(--p-2xl) var(--p-md);
                    border-radius: var(--br-m);
                }

                .plan-title > div {
                    position: relative;
                    display: grid;
                    grid-template: "h1 h1" "btn btn" / 1fr auto;
                    align-items: center;
                    justify-items: center;
                    background-color: var(--bg-color);
                    border-radius: var(--br-m);
                    box-shadow: 0 3px 9px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 800px;
                    padding: var(--p-xl) var(--p-md);
                }

                .plan-title h1 {
                    grid-area: h1;
                    text-align: center;
                    font-family: 'Rubik';
                    font-size: clamp(1.5rem, 4vw, 3rem);
                    margin: 0;
                    color: var(--text-color-0);
                }

                /* Suggestion Section */
                .suggestion {
                    grid-area: suggestion;
                    display: grid;
                    grid-template:
                        "title sm" auto
                        "list  list" 1fr / 1fr auto;
                    overflow: hidden;
                    width: 100%;
                    padding: var(--p-xl) var(--p-md);
                    background-color: var(--bg-color);
                    border-radius: var(--br-m);
                    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
                }

                .suggestion h3 {
                    grid-area: title;
                    text-align: start;
                    font-family: 'Rubik';
                    font-size: clamp(1rem, 2.5vw, 1.5rem);
                    margin: 0;
                    color: var(--text-color-0);
                }

                .more-spots {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    gap: var(--gap-size-s);
                    color: var(--text-color-2);
                    margin-left: auto;
                    margin-right: var(--m-xl);
                    text-decoration: none;
                    cursor: pointer;
                }

                .more-spots p {
                    margin: 0;
                    font-size: var(--fs-base);
                }

                .more-icon {
                    width: var(--svg-s);
                    height: var(--svg-s);
                    color: var(--text-color-2);
                    transition: transform 0.2s ease;
                }

                .more-spots:hover .more-icon {
                    transform: translateX(4px);
                }

                .TL {
                    grid-area: list;
                    display: grid;
                    grid-auto-flow: column;
                    grid-auto-columns: 280px;
                    gap: var(--gap-size-s);
                    overflow-x: auto;
                    padding-block: var(--p-sm);
                }

                /* Route Section */
                ag-route-section {
                    grid-area: route;
                    width: 100%;
                    display: block;
                }

                .empty-state {
                    text-align: center;
                    padding: var(--p-2xl);
                    color: var(--text-color-3);
                    font-family: 'NunitoSans';
                }

                .empty-state p:first-child {
                    font-size: var(--fs-lg);
                    margin-bottom: var(--m-sm);
                }

                .empty-state p:last-child {
                    font-size: var(--fs-base);
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .main-container {
                        padding: var(--p-lg) var(--p-sm);
                        row-gap: var(--gap-size-l);
                    }

                    .plan-title {
                        padding: var(--p-xl) var(--p-sm);
                    }

                    .plan-title > div {
                        padding: var(--p-lg) var(--p-sm);
                    }

                    .plan-title h1 {
                        font-size: clamp(1.25rem, 3vw, 2rem);
                    }

                    .suggestion {
                        padding: var(--p-lg) var(--p-sm);
                    }

                    .TL {
                        grid-auto-columns: 260px;
                    }
                }

                @media (max-width: 480px) {
                    .main-container {
                        padding: var(--p-md) var(--p-xs);
                    }

                    .plan-title {
                        padding: var(--p-lg) var(--p-xs);
                    }

                    .suggestion {
                        padding: var(--p-md) var(--p-xs);
                    }

                    .more-spots {
                        margin-right: 0;
                    }
                }
            </style>

            <div class="main-container">
                <!-- Plan Title -->
                <div class="plan-title">
                    <div>
                        <h1>Төлөвлөгөөний гарчиг №1</h1>
                        <ag-share-button></ag-share-button>
                    </div>
                </div>

                <!-- Suggested Spots -->
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
                            zrg="../files/spot-img/spot01-1.jpg"
                            bus="Төв"
                            unelgee="4.5"
                            ner="Цонжин Болдог"
                            cate="Соёл"
                            activity="Морин аялал, Амьтантай ойр"
                            une="20,000₮"
                            age="Бүх нас"
                            data-spot-id="1">
                        </ag-spot-card>
                        <ag-spot-card
                            zrg="../files/spot-img/spot07-1.jpg"
                            bus="Төв"
                            unelgee="4.5"
                            ner="Гандан Тэгчинлэн Хийд"
                            cate="Соёл"
                            activity="Түүхэн"
                            une="5,000₮"
                            age="Бүх нас"
                            data-spot-id="7">
                        </ag-spot-card>
                        <ag-spot-card
                            zrg="../files/spot-img/spot02-1.jpg"
                            bus="Хангай"
                            unelgee="4.3"
                            ner="Амарбаясгалант хийд"
                            cate="Соёл"
                            activity="Түүхэн"
                            une="500,000₮"
                            age="Бүх нас"
                            data-spot-id="2">
                        </ag-spot-card>
                        <ag-spot-card
                            zrg="../files/spot-img/spot03-1.jpg"
                            bus="Төв"
                            unelgee="4.5"
                            ner="Хустайн байгалийн цогцолбор"
                            cate="Байгаль"
                            une="15,000₮"
                            activity="Морин аялал, Сур харваа"
                            age="Бүх нас"
                            data-spot-id="3">
                        </ag-spot-card>
                        <ag-spot-card
                            zrg="../files/spot-img/spot14-1.jpg"
                            bus="Алтай"
                            unelgee="4.5"
                            ner="Алтай Таван Богд"
                            cate="Байгаль, Амралт сувилал"
                            une="80,000₮"
                            age="Бүх нас"
                            data-spot-id="14">
                        </ag-spot-card>
                    </div>
                </div>

                <!-- Route Section - Dynamic -->
                <ag-route-section id="route-section">
                    <!-- Route items will be dynamically rendered here -->
                </ag-route-section>
            </div>
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

        // If no items, show placeholder
        if (planItems.length === 0) {
            routeSection.innerHTML = `
                <div class="empty-state">
                    <p>Таны төлөвлөгөө хоосон байна</p>
                    <p>Дээрх санал болгосон цэгүүд эсвэл "Аяллын Цэгүүд" хуудаснаас сонирхолтой газруудаа нэмээрэй!</p>
                </div>
            `;
            return;
        }

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
            routeItem.setAttribute('img1', item.img1 || item.image || '');
            routeItem.setAttribute('img2', item.img2 || item.img1 || item.image || '');
            routeItem.setAttribute('img3', item.img3 || item.img1 || item.image || '');
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

        // Handle plan-add-result events from ag-spot-card
        this.addEventListener('plan-add-result', (e) => {
            const toast = document.querySelector('ag-toast');
            if (!toast) return;

            const status = e.detail ? e.detail.status : null;
            if (status === 'added') {
                toast.show('Төлөвлөгөөнд нэмэгдлээ!', 'success', 3000);
            } else if (status === 'exists') {
                toast.show('Энэ газар аль хэдийн төлөвлөгөөнд байна', 'info', 3000);
            } else {
                toast.show('Төлөвлөгөөнд нэмэх үед алдаа гарлаа', 'error', 3000);
            }
        });

        // Handle add-item events from route-section (Газар нэмэх, Тэмдэглэл нэмэх)
        this.addEventListener('add-item', (e) => {
            const { type } = e.detail;

            if (type === 'place') {
                this.showAddPlaceDialog();
            } else if (type === 'note') {
                this.showAddNoteDialog();
            }
        });
    }

    // Газар нэмэх dialog харуулах
    showAddPlaceDialog() {
        // Spots хуудас руу шилжүүлэх эсвэл popup харуулах
        const confirmed = confirm('Аяллын цэг нэмэхийн тулд "Аяллын Цэгүүд" хуудас руу шилжих үү?');
        if (confirmed) {
            window.location.hash = '#/spots';
        }
    }

    // Тэмдэглэл нэмэх dialog харуулах
    showAddNoteDialog() {
        const noteText = prompt('Тэмдэглэл оруулна уу:');

        if (noteText && noteText.trim()) {
            // Create note element
            const routeSection = this.querySelector('#route-section');
            if (!routeSection) return;

            // Count existing notes to set number
            const existingNotes = routeSection.querySelectorAll('ag-note-item');
            const noteNumber = existingNotes.length + 1;

            const noteElement = document.createElement('ag-note-item');
            noteElement.setAttribute('note-text', noteText.trim());
            noteElement.setAttribute('number', noteNumber);

            // Add note to the end of route section
            routeSection.appendChild(noteElement);

            alert('Тэмдэглэл амжилттай нэмэгдлээ!');
        }
    }
}

customElements.define('page-plan', PagePlan);
