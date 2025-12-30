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
            <h1 class="visually-hidden">Аяллын төлөвлөгөө</h1>
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
                    <h2>Танд санал болгох аяллын цэгүүд</h2>
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
                    <p>Доорх санал болгосон цэгүүд эсвэл "Аяллын Цэгүүд" хуудаснаас сонирхолтой газруудаа нэмээрэй!</p>
                </div>
            `;
            return;
        }

        // Render each plan item
        planItems.forEach((item) => {
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
                    window.location.hash = `#/spot-info?spotId=${spotId}`;
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
            e.stopPropagation(); // Prevent event from bubbling up
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

        let insertIndex = 0;
        if (divider) {
            let prev = divider.previousElementSibling;
            while (prev && prev.tagName !== 'AG-ROUTE-ITEM') {
                prev = prev.previousElementSibling;
            }
            if (prev) {
                const routeItems = Array.from(routeSection.querySelectorAll('ag-route-item'));
                insertIndex = routeItems.indexOf(prev) + 1;
            }
        }

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
                        const items = window.appState.getPlanItems();
                        const addedIndex = items.findIndex(item => String(item.id) === String(selectedSpot.id));
                        if (addedIndex > -1) {
                            const [addedItem] = items.splice(addedIndex, 1);
                            const safeIndex = Math.min(Math.max(insertIndex, 0), items.length);
                            items.splice(safeIndex, 0, addedItem);
                            items.forEach((item, idx) => {
                                item.number = idx + 1;
                            });
                            window.appState.savePlanToStorage();
                            window.appState.dispatchStateChange('planItems', items);
                        }
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
        const existingNotes = routeSection.querySelectorAll('ag-note-item');
        const noteNumber = existingNotes.length + 1;

        // Create empty note element immediately
        const noteElement = document.createElement('ag-note-item');
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
