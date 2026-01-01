/**
 * ========================================
 * PagePlan - Аяллын төлөвлөгөө хуудас
 * ========================================
 *
 * Энэхүү компонент нь хэрэглэгчийн аяллын төлөвлөгөөг удирдах үндсэн интерфэйс юм.
 * Хэрэглэгч энд дараах үйлдлүүдийг хийх боломжтой:
 * - Төлөвлөгөөнд газар нэмэх/хасах
 * - Газруудын эрэмбэ солих (drag & drop)
 * - Хөтөч сонгох
 * - Тэмдэглэл нэмэх
 * - Төлөвлөгөөгөө хуваалцах
 */
class PagePlan extends HTMLElement {
    /**
     * Конструктор - Компонентыг үүсгэх үед ажиллана
     */
    constructor() {
        super();
    }

    /**
     * connectedCallback - Компонент DOM-д холбогдох үед автоматаар ажиллана
     *
     * Үүрэг:
     * 1. Хуудсыг дүрсэлнэ (render)
     * 2. Event listener-ууд суулгана
     * 3. appState-ийн өөрчлөлтийг сонсож эхэлнэ
     */
    connectedCallback() {
        this.render();
        this.attachEventListeners();

        // appState-ийн өөрчлөлтийг сонсох функц
        // Төлөвлөгөөний жагсаалт өөрчлөгдөх бүрд хуудсыг шинэчилнэ
        this.handleStateChange = (e) => {
            if (e.detail.key === 'planItems') {
                this.updatePlanItems();
            }
        };
        window.addEventListener('appstatechange', this.handleStateChange);
    }

    /**
     * disconnectedCallback - Компонент DOM-оос салах үед автоматаар ажиллана
     *
     * Үүрэг: Event listener-ийг цэвэрлэж, санах ойн зарцуулалтыг багасгана
     */
    disconnectedCallback() {
        // Компонент устах үед event listener-ийг цэвэрлэнэ
        if (this.handleStateChange) {
            window.removeEventListener('appstatechange', this.handleStateChange);
        }
    }

    /**
     * render - Хуудсыг дүрсэлнэ
     *
     * Үүрэг:
     * 1. HTML бүтцийг үүсгэнэ
     * 2. Төлөвлөгөөний жагсаалтыг харуулна
     * 3. Санал болгосон газруудыг харуулна
     * 4. Төлөвлөгөөний гарчигийн талбарыг тохируулна
     */
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

    /**
     * updatePlanItems - Төлөвлөгөөний жагсаалтыг шинэчилнэ
     *
     * Үүрэг:
     * 1. appState-аас төлөвлөгөөний жагсаалт авна
     * 2. Хуучин элементүүдийг цэвэрлэнэ
     * 3. Шинэ элементүүдийг үүсгэж нэмнэ
     * 4. Хадгалагдсан хөтөчийн сонголтыг ачаална
     */
    updatePlanItems() {
        const routeSection = this.querySelector('#route-section');
        if (!routeSection) return;

        const planItems = window.appState.getPlanItems();

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

            // Хадгалагдсан хөтөчийн сонголтыг ачаалах
            const savedGuides = JSON.parse(localStorage.getItem('ayalgo-selected-guides') || '{}');
            if (savedGuides[item.id]) {
                routeItem.setAttribute('selected-guide', savedGuides[item.id]);
            }

            routeSection.appendChild(routeItem);
        });
    }

    /**
     * attachEventListeners - Event listener-ууд суулгана
     *
     * Үүрэг:
     * 1. Санал болгосон газар дарах үед дэлгэрэнгүй хуудас руу шилжих
     * 2. Газар устгах үйлдлийг зохицуулах
     * 3. Газар нэмэх үр дүнгийн toast мэдэгдэл харуулах
     * 4. Газар/Тэмдэглэл нэмэх event-үүдийг зохицуулах
     */
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

        // route-section-аас ирсэн газар/тэмдэглэл нэмэх event-үүдийг зохицуулах
        this.addEventListener('add-item', (e) => {
            e.stopPropagation(); // Event-ийн дамжилтыг зогсоох
            const { type, divider } = e.detail;

            if (type === 'place') {
                this.showAddPlaceDialog(divider);
            } else if (type === 'note') {
                this.showAddNoteDialog(divider);
            }
        });
    }

    /**
     * showAddPlaceDialog - Газар нэмэх dialog харуулна
     *
     * Параметр:
     * @param {HTMLElement} divider - Хуваагч элемент (газар оруулах байрлалыг тодорхойлно)
     *
     * Үүрэг:
     * 1. Аль байрлалд газар нэмэхийг тодорхойлно
     * 2. Төлөвлөгөөнд байхгүй газруудыг шүүнэ
     * 3. Хэрэглэгчээс газар сонгуулна
     * 4. Сонгосон газрыг төлөвлөгөөнд нэмнэ
     * 5. Үр дүнгийн мэдэгдэл харуулна
     */
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

    /**
     * showAddNoteDialog - Тэмдэглэл нэмэх dialog харуулна
     *
     * Параметр:
     * @param {HTMLElement} divider - Хуваагч элемент (тэмдэглэл оруулах байрлалыг тодорхойлно)
     *
     * Үүрэг:
     * 1. Шинэ тэмдэглэл элемент үүсгэнэ
     * 2. Зөв байрлалд оруулна
     * 3. Засварлах горимд шилжүүлнэ
     * 4. Мэдэгдэл харуулна
     */
    showAddNoteDialog(divider) {
        const routeSection = this.querySelector('#route-section');
        if (!routeSection) return;

        // Тэмдэглэлийн дугаарыг тодорхойлох
        const existingNotes = routeSection.querySelectorAll('ag-note-item');
        const noteNumber = existingNotes.length + 1;

        // Хоосон тэмдэглэл элемент үүсгэх
        const noteElement = document.createElement('ag-note-item');
        noteElement.setAttribute('note-text', 'Энд тэмдэглэл бичнэ үү...');
        noteElement.setAttribute('number', noteNumber);

        // Divider өгөгдсөн бол дараа нь, үгүй бол төгсгөлд нэмэх
        if (divider && divider.parentElement) {
            divider.parentElement.insertBefore(noteElement, divider.nextSibling);
        } else {
            routeSection.appendChild(noteElement);
        }

        // Тэмдэглэлийг засварлах горимд оруулах
        setTimeout(() => {
            const editBtn = noteElement.shadowRoot?.querySelector('.edit');
            if (editBtn) {
                editBtn.click();
            }
        }, 100);

        // Амжилттай нэмэгдсэн мэдэгдэл харуулах
        const toast = document.querySelector('ag-toast');
        if (toast) {
            toast.show('Тэмдэглэл нэмэгдлээ! Засахын тулд дарна уу.', 'success', 3000);
        }
    }

    /**
     * setupPlanTitle - Төлөвлөгөөний гарчигийн талбарыг тохируулна
     *
     * Үүрэг:
     * 1. Автоматаар өндрийг өөрчилнө (агуулгад тохируулна)
     * 2. Хэрэглэгч өөрчлөх бүрд хадгална
     * 3. Хадгалагдсан гарчгийг ачаална
     */
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

    /**
     * renderTopRatedSpots - Дээд үнэлгээтэй газруудыг харуулна
     *
     * Үүрэг:
     * 1. appState-аас бүх газруудыг авна
     * 2. Үнэлгээгээр буурах дарааллаар эрэмбэлнэ
     * 3. Эхний 5 газрыг сонгоно
     * 4. ag-spot-card компонентуудыг үүсгэж харуулна
     */
    renderTopRatedSpots() {
        const topRatedSection = this.querySelector('#top-rated-section');
        if (!topRatedSection) return;

        const spots = window.appState?.getAllSpots();
        if (!spots || spots.length === 0) return;

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

// Компонентыг Custom Element болгон бүртгэх
customElements.define('ag-page-plan', PagePlan);
