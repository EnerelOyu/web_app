class PagePlan extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();

        // appState-ийн өөрчлөлтийг сонсох функц
        // Төлөвлөгөөний жагсаалт өөрчлөгдөх бүрд хуудсыг шинэчилнэ
        this.handleStateChange = (e) => {
            if (e.detail.key === 'planItems') {
                this.updatePlanItems();
            }
            if (e.detail.key === 'spotData') {
                this.renderTopRatedSpots();
            }
        };
        window.addEventListener('appstatechange', this.handleStateChange);
    }

    // disconnectedCallback - Компонент DOM-оос салах үед автоматаар ажиллана, санах ойн зарцуулалтыг багасгана
    disconnectedCallback() {
        // Компонент устах үед event listener-ийг цэвэрлэнэ
        if (this.handleStateChange) {
            window.removeEventListener('appstatechange', this.handleStateChange);
        }
    }

    render() {
        this.innerHTML = `
            <h1 class="visually-hidden">Аяллын төлөвлөгөө</h1>
            <div class="main-container">
                <!-- Төлөвлөгөөний гарчиг -->
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

                <!-- Санал болгосон газрууд -->
                <div class="suggestion">
                    <h2>Өндөр үнэлгээтэй аяллын цэгүүд</h2>
                    <a href="#/spots" class="more-spots">
                        <p>Бүгдийг харах</p>
                        <svg class="more-icon">
                            <use href="./styles/icons.svg#icon-arrow"></use>
                        </svg>
                    </a>
                    <div class="TL" id="top-rated-section">
                        <!-- Өндөр үнэлгээтэй газрууд энд динамикаар нэмэгдэнэ -->
                    </div>
                </div>

                <!-- Төлөвлөгөөний жагсаалт - Динамик контент -->
                <ag-route-section id="route-section">
                    <!-- Маршрутын элементүүд энд динамикаар нэмэгдэнэ -->
                </ag-route-section>
            </div>
        `;

        // Төлөвлөгөөний газруудыг анхны удаа харуулна
        this.updatePlanItems();

        // Дээд үнэлгээтэй газруудыг харуулна
        this.renderTopRatedSpots();

        // Гарчигийн талбарыг тохируулна
        this.setupPlanTitle();
    }

    updatePlanItems() {
        const routeSection = this.querySelector('#route-section');
        if (!routeSection) return;

        const planItems = window.appState?.getPlanItems?.() || [];

        // Хуучин элементүүдийг цэвэрлэх
        routeSection.innerHTML = '';

        // Хоосон байвал placeholder харуулах
        if (planItems.length === 0) {
            routeSection.innerHTML = `
                <div class="empty-state">
                    <p>Таны төлөвлөгөө хоосон байна</p>
                    <p>Доорх санал болгосон цэгүүд эсвэл "Аяллын Цэгүүд" хуудаснаас сонирхолтой газруудаа нэмээрэй!</p>
                </div>
            `;
            return;
        }

        // Төлөвлөгөөний газар бүрийг дүрсэлнэ
        planItems.forEach((item) => {
            // Маршрутын элемент үүсгэх
            const routeItem = document.createElement('ag-route-item');
            const title = item.customTitle || item.title || item.name || '';
            const mapQuery = item.detailLocation || item.name || title || '';

            routeItem.setAttribute('number', item.number);
            routeItem.setAttribute('title', title);
            routeItem.setAttribute('description', item.description || item.descriptionLong || '');
            routeItem.setAttribute('img1', item.img1 || item.imgMainUrl || item.image || '');
            routeItem.setAttribute('img2', item.img2 || item.img2Url || item.img1 || item.imgMainUrl || '');
            routeItem.setAttribute('img3', item.img3 || item.img3Url || item.img1 || item.imgMainUrl || '');
            routeItem.setAttribute('map-query', mapQuery);
            routeItem.setAttribute('draggable', 'true');
            routeItem.setAttribute('data-spot-id', item.id);
            routeItem.setAttribute('region', item.region || item.area || '');

            // Хадгалагдсан хөтөчийн сонголтыг ачаалах
            const savedGuides = JSON.parse(localStorage.getItem('ayalgo-selected-guides') || '{}');
            if (savedGuides[item.id]) {
                routeItem.setAttribute('selected-guide', savedGuides[item.id]);
            }

            routeSection.appendChild(routeItem);
        });
    }

    attachEventListeners() {
        // Санал болгосон газар дарах үйлдлийг зохицуулах
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

        // Газар устгах үйлдлийг зохицуулах
        this.addEventListener('delete-item', async (e) => {
            const item = e.detail.item;
            const spotId = item.getAttribute('data-spot-id');
            if (spotId) {
                await window.appState.removeFromPlan(spotId);
            }
        });

        // ag-spot-card-аас ирсэн төлөвлөгөө нэмэх үр дүнгийг зохицуулах
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

        // route-section-аас ирсэн газар нэмэх event зохицуулах
        this.addEventListener('add-item', (e) => {
            e.stopPropagation(); // Event-ийн дамжилтыг зогсоох
            const { divider } = e.detail;
            this.showAddPlaceDialog(divider);
        });
    }

    //Газар нэмэх dialog харуулна
    showAddPlaceDialog(divider) {
        const routeSection = this.querySelector('#route-section');
        if (!routeSection) return;

        // Оруулах байрлалыг олох
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

        // appState-аас боломжтой газруудыг авах
        const allSpots = window.appState?.getAllSpots() || [];
        const planItems = window.appState?.getPlanItems() || [];
        const planSpotIds = planItems.map(item => String(item.id));

        // Төлөвлөгөөнд байгаа газруудыг хасах
        const availableSpots = allSpots.filter(spot => !planSpotIds.includes(String(spot.id)));

        // Боломжтой газар байхгүй бол мэдэгдэл харуулах
        if (availableSpots.length === 0) {
            const toast = document.querySelector('ag-toast');
            if (toast) {
                toast.show('Бүх газрыг аль хэдийн нэмсэн байна!', 'info', 3000);
            }
            return;
        }

        // Сонгох цонх үүсгэх
        const spotNames = availableSpots.map((spot, idx) => `${idx + 1}. ${spot.title || spot.name}`).join('\n');
        const selection = prompt(`Нэмэх газраа сонгоно уу (1-${availableSpots.length}):\n\n${spotNames}`);

        if (selection) {
            const index = parseInt(selection) - 1;
            if (index >= 0 && index < availableSpots.length) {
                const selectedSpot = availableSpots[index];

                // appState ашиглан төлөвлөгөөнд нэмэх (async)
                window.appState.addToPlan(selectedSpot.id).then(result => {
                    const toast = document.querySelector('ag-toast');
                    if (!toast) return;

                    if (result === true) {
                        // Нэмэгдсэн газрыг зөв байрлалд оруулах
                        const items = window.appState.getPlanItems();
                        const addedIndex = items.findIndex(item => String(item.id) === String(selectedSpot.id));
                        if (addedIndex > -1) {
                            const [addedItem] = items.splice(addedIndex, 1);
                            const safeIndex = Math.min(Math.max(insertIndex, 0), items.length);
                            items.splice(safeIndex, 0, addedItem);
                            // Дугаарлалтыг шинэчлэх
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

    setupPlanTitle() {
        const titleInput = this.querySelector('#plan-title-input');
        if (!titleInput) return;

        // Textarea-ийн өндрийг автоматаар өөрчилнө
        const autoResize = () => {
            titleInput.style.height = 'auto';
            titleInput.style.height = titleInput.scrollHeight + 'px';
        };

        // Анхны өндрийг тохируулах
        autoResize();

        // Өөрчлөлт бүрд өндрийг дахин тохируулах
        titleInput.addEventListener('input', autoResize);

        // Хэрэглэгч өөр газар дарах үед хадгалах
        titleInput.addEventListener('blur', async () => {
            const title = titleInput.value.trim();
            if (title) {
                // localStorage-д хадгалах
                localStorage.setItem('ayalgo-plan-title', title);

                // ДАВАА: Backend DB-д хадгалах (schema-д гарчгийн талбар нэмэх хэрэгтэй)
                // Одоогоор зөвхөн localStorage-д хадгалж байна
            }
        });

        // Хадгалагдсан гарчгийг ачаалах
        const savedTitle = localStorage.getItem('ayalgo-plan-title');
        if (savedTitle) {
            titleInput.value = savedTitle;
            autoResize();
        }
    }

    renderTopRatedSpots() {
        const topRatedSection = this.querySelector('#top-rated-section');
        if (!topRatedSection) return;

        const spots = window.appState?.getAllSpots?.() || [];
        if (spots.length === 0) {
            topRatedSection.innerHTML = `
                <div class="empty-state">
                    <p>Одоогоор санал болгох аяллын цэг алга байна</p>
                    <p>Өгөгдөл ачаалсны дараа энд гарч ирнэ.</p>
                </div>
            `;
            return;
        }

        // Үнэлгээгээр буурах дарааллаар эрэмбэлж, эхний 5-ийг авах
        const topRatedSpots = [...spots]
            .sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
            .slice(0, 5);

        // ag-spot-card HTML үүсгэх (бүх шаардлагатай атрибутуудтай)
        const spotsHTML = topRatedSpots.map(spot => `
            <ag-spot-card
                zrg="${spot.img1 || spot.image || ''}"
                bus="${spot.region || ''}"
                unelgee="${spot.rating || 0}"
                ner="${spot.title || spot.name || ''}"
                cate="${spot.category || ''}"
                activity="${spot.activities || ''}"
                une="${spot.price || ''}"
                age="${spot.age || ''}"
                href="#/spot-info?spotId=${spot.id}"
                data-spot-id="${spot.id}">
            </ag-spot-card>
        `).join('');

        // Section дотор spot-уудыг оруулах
        topRatedSection.innerHTML = spotsHTML;
    }
}

customElements.define('ag-page-plan', PagePlan);
