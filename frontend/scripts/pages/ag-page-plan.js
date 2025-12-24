class PagePlan extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();

        // Listen for state changes (bind to this instance)
        this.handleStateChange = (e) => {
            if (e.detail.key === 'planItems') {
                this.updatePlanItems();
            }
        };
        window.addEventListener('appstatechange', this.handleStateChange);
    }

    disconnectedCallback() {
        // Clean up event listener when component is removed
        if (this.handleStateChange) {
            window.removeEventListener('appstatechange', this.handleStateChange);
        }
    }

    render() {
        this.innerHTML = `
            <style>
                @import url('/styles/fonts.css');

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
                    min-height: calc(100 * var(--vh) - var(--header-height) - var(--footer-height));
                    margin: 0 auto;
                    max-width: 1200px;
                    width: 100%;
                    row-gap: var(--gap-size-xl);
                    padding-inline: var(--spacing-vw-sm);
                }

                /* Plan Title Section */
                .plan-title {
                    grid-area: plan-title;
                    display: grid;
                    grid-template: "h1" "btn" / 1fr;
                    justify-items: center;
                    align-items: center;
                    background: url("./assets/images/spot-img/spot04-1.jpg") no-repeat center / cover;
                    width: 100%;
                    padding: var(--spacing-vh-sm) var(--spacing-vw-sm);
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
                    box-shadow: 0 3px 9px var(--text-color-1);
                    width: 100%;
                    max-width: 800px;
                    padding: var(--spacing-vh-sm) var(--spacing-vw-sm);
                }

                .plan-title-input {
                    grid-area: h1;
                    text-align: center;
                    font-family: 'Rubik';
                    font-size: clamp(1.5rem, 4vw, 3rem);
                    font-weight: 700;
                    margin: 0;
                    padding: var(--p-sm);
                    color: var(--text-color-0);
                    background: transparent;
                    border: 2px solid transparent;
                    border-radius: var(--br-s);
                    resize: none;
                    overflow: hidden;
                    transition: all 0.2s ease;
                    width: 100%;
                    box-sizing: border-box;
                }

                .plan-title-input:focus {
                    outline: none;
                    border-color: var(--primary);
                    background: rgba(255, 255, 255, 0.9);
                }

                .plan-title-input::placeholder {
                    color: var(--text-color-5);
                    opacity: 0.7;
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
                    padding: var(--spacing-vh-sm) var(--spacing-vw-sm);
                    background-color: var(--bg-color);
                    border-radius: var(--br-m);
                    box-shadow: 0 4px 14px rgba(0,0,0,0.06);
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
                        padding-inline: var(--p-md);
                    }

                    .TL {
                        grid-auto-columns: 260px;
                    }
                }

                @media (max-width: 480px) {
                    .more-spots {
                        margin-right: 0;
                    }
                }
            </style>

            <div class="main-container">
                <!-- Plan Title -->
                <div class="plan-title">
                    <div>
                        <textarea
                            id="plan-title-input"
                            class="plan-title-input"
                            placeholder="Төлөвлөгөөний гарчиг оруулна уу..."
                            rows="1">Мини аялал</textarea>
                        <ag-share-button></ag-share-button>
                    </div>
                </div>

                <!-- Suggested Spots -->
                <div class="suggestion">
                    <h3>Танд санал болгох аяллын цэгүүд</h3>
                    <a href="#/spots" class="more-spots">
                        <p>Бүгдийг харах</p>
                        <svg class="more-icon">
                            <use href="/styles/icons.svg#icon-arrow"></use>
                        </svg>
                    </a>
                    <div class="TL">
                        <ag-spot-card
                            zrg="../assets/images/spot-img/spot01-1.jpg"
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
                            zrg="../assets/images/spot-img/spot07-1.jpg"
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
                            zrg="../assets/images/spot-img/spot02-1.jpg"
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
                            zrg="../assets/images/spot-img/spot03-1.jpg"
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
                            zrg="../assets/images/spot-img/spot14-1.jpg"
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

        // Setup plan title textarea
        this.setupPlanTitle();
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
            routeItem.setAttribute('region', item.region || '');

            // Load saved guide selection
            const savedGuides = JSON.parse(localStorage.getItem('ayalgo-selected-guides') || '{}');
            if (savedGuides[item.id]) {
                routeItem.setAttribute('selected-guide', savedGuides[item.id]);
            }

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
        this.addEventListener('delete-item', async (e) => {
            const item = e.detail.item;
            const spotId = item.getAttribute('data-spot-id');
            if (spotId) {
                await window.appState.removeFromPlan(spotId);
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
            const { type, divider } = e.detail;

            if (type === 'place') {
                this.showAddPlaceDialog(divider);
            } else if (type === 'note') {
                this.showAddNoteDialog(divider);
            }
        });
    }

    // Газар нэмэх dialog харуулах
    showAddPlaceDialog(divider) {
        const routeSection = this.querySelector('#route-section');
        if (!routeSection) return;

        // Get available spots from appState
        const allSpots = window.appState?.getAllSpots() || [];
        const planItems = window.appState?.getPlanItems() || [];
        const planSpotIds = planItems.map(item => String(item.id));

        // Filter out spots already in plan
        const availableSpots = allSpots.filter(spot => !planSpotIds.includes(String(spot.id)));

        if (availableSpots.length === 0) {
            const toast = document.querySelector('ag-toast');
            if (toast) {
                toast.show('Бүх газрыг аль хэдийн нэмсэн байна!', 'info', 3000);
            }
            return;
        }

        // Create a simple selection dialog
        const spotNames = availableSpots.map((spot, idx) => `${idx + 1}. ${spot.title || spot.name}`).join('\n');
        const selection = prompt(`Нэмэх газраа сонгоно уу (1-${availableSpots.length}):\n\n${spotNames}`);

        if (selection) {
            const index = parseInt(selection) - 1;
            if (index >= 0 && index < availableSpots.length) {
                const selectedSpot = availableSpots[index];

                // Add to plan via appState (now async)
                window.appState.addToPlan(selectedSpot.id).then(result => {
                    const toast = document.querySelector('ag-toast');
                    if (!toast) return;

                    if (result === true) {
                        toast.show(`${selectedSpot.title || selectedSpot.name} нэмэгдлээ!`, 'success', 3000);
                    } else if (result === 'exists') {
                        toast.show('Энэ газар аль хэдийн төлөвлөгөөнд байна', 'info', 3000);
                    } else {
                        toast.show('Төлөвлөгөөнд нэмэх үед алдаа гарлаа', 'error', 3000);
                    }
                });
            }
        }
    }

    // Тэмдэглэл нэмэх dialog харуулах
    showAddNoteDialog(divider) {
        const routeSection = this.querySelector('#route-section');
        if (!routeSection) return;

        // Count existing notes to set number
        const existingNotes = routeSection.querySelectorAll('app-note-item');
        const noteNumber = existingNotes.length + 1;

        // Create empty note element immediately
        const noteElement = document.createElement('app-note-item');
        noteElement.setAttribute('note-text', 'Энд тэмдэглэл бичнэ үү...');
        noteElement.setAttribute('number', noteNumber);

        // If divider is provided, insert after it; otherwise append to end
        if (divider && divider.parentElement) {
            divider.parentElement.insertBefore(noteElement, divider.nextSibling);
        } else {
            routeSection.appendChild(noteElement);
        }

        // Focus on the note for editing
        setTimeout(() => {
            const editBtn = noteElement.shadowRoot?.querySelector('.edit');
            if (editBtn) {
                editBtn.click();
            }
        }, 100);

        // Show toast notification
        const toast = document.querySelector('ag-toast');
        if (toast) {
            toast.show('Тэмдэглэл нэмэгдлээ! Засахын тулд дарна уу.', 'success', 3000);
        }
    }

    // Setup plan title textarea
    setupPlanTitle() {
        const titleInput = this.querySelector('#plan-title-input');
        if (!titleInput) return;

        // Auto-resize textarea
        const autoResize = () => {
            titleInput.style.height = 'auto';
            titleInput.style.height = titleInput.scrollHeight + 'px';
        };

        // Initial resize
        autoResize();

        // Resize on input
        titleInput.addEventListener('input', autoResize);

        // Save to backend on blur (when user clicks away)
        titleInput.addEventListener('blur', async () => {
            const title = titleInput.value.trim();
            if (title) {
                // Save to localStorage
                localStorage.setItem('ayalgo-plan-title', title);

                // TODO: Save to backend DB when we add plan title field to schema
                // For now, just save locally
            }
        });

        // Load saved title
        const savedTitle = localStorage.getItem('ayalgo-plan-title');
        if (savedTitle) {
            titleInput.value = savedTitle;
            autoResize();
        }
    }
}

customElements.define('ag-page-plan', PagePlan);
