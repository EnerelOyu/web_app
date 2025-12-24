class PageHome extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.setupToast();
        this.attachEventListeners();
    }

    setupToast() {
        // Create toast element if it doesn't exist
        if (!document.querySelector('ag-toast')) {
            const toast = document.createElement('ag-toast');
            document.body.appendChild(toast);
        }
        this.toast = document.querySelector('ag-toast');
    }

    render() {
        this.innerHTML = `
        <style>
            @import url('/styles/fonts.css');

            main {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                animation: fadeIn 0.6s ease-out;
                gap: var(--gap-size-m);
                padding: 0;
                margin: 0;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Hero Section */
            .hero-section {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: var(--gap-size-m);
                padding: var(--p-xl) 0;
            }

            .uria {
                font-size: var(--fs-xl);
                font-style: italic;
                color: var(--text-color-1);
                text-align: center;
                font-family: 'NunitoSans';
                animation: slideDown 0.8s ease-out;
                margin: 0;
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .uria-h1 {
                font-size: var(--fs-3xl);
                font-weight: bold;
                text-align: center;
                color: var(--text-color-1);
                font-family: 'Rubik';
                animation: slideUp 1s ease-out 0.2s backwards;
                margin: 0;
                padding: var(--p-md) 0;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .uria-h1 span {
                color: var(--primary);
                position: relative;
                display: inline-block;
            }

            .uria-h1 span::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 0;
                width: 0;
                height: 3px;
                background-color: var(--secondary);
                transition: width 0.5s ease;
            }

            .uria-h1:hover span::after {
                width: 100%;
            }

            /* Search Section */
            .search-section {
                width: 100%;
                max-width: 1000px;
                display: flex;
                justify-content: center;
                padding: var(--p-lg) 0;
            }

            /* Features Grid */
            .rec-grid {
                width: 100%;
                max-width: 1200px;
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: var(--gap-size-l);
                padding: var(--p-xl) 0;
            }

            /* Tutorial Section */
            .tutorial {
                width: 100%;
                max-width: 1400px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: var(--gap-size-xl);
                padding: var(--p-2xl) 0;
            }

            .tutorial h3 {
                color: var(--text-color-1);
                font-size: var(--fs-xl);
                font-weight: bold;
                font-family: 'Rubik';
                text-align: center;
                text-transform: uppercase;
                margin: 0;
            }

            .tutorial-grid {
                width: 100%;
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: var(--gap-size-l);
            }

            /* Spot Sections */
            ag-spot-section {
                width: 100%;
                padding: var(--p-xl) 0;
            }

            /* Guide Banner */
            ag-guide-banner {
                width: 100%;
                padding: var(--p-2xl) 0;
            }

            /* Responsive Design */
            @media (max-width: 1024px) {
                main {
                    gap: var(--gap-size-xl);
                    padding: var(--p-xl) var(--p-md);
                }

                .rec-grid {
                    grid-template-columns: repeat(2, 1fr);
                    max-width: 90vw;
                }

                .tutorial-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            @media (max-width: 768px) {
                main {
                    gap: var(--gap-size-l);
                    padding: var(--p-lg) var(--p-sm);
                }

                .uria {
                    font-size: var(--fs-base);
                }

                .uria-h1 {
                    font-size: var(--fs-xl);
                    padding: var(--p-sm) 0;
                }

                .rec-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: var(--gap-size-m);
                }

                .tutorial h3 {
                    font-size: var(--fs-lg);
                }

                .tutorial-grid {
                    grid-template-columns: 1fr;
                    gap: var(--gap-size-m);
                }
            }

            @media (max-width: 480px) {
                main {
                    width: 100%;
                }

                .uria-h1 {
                    font-size: var(--fs-lg);
                }

                .rec-grid {
                    grid-template-columns: 1fr;
                    gap: var(--gap-size-s);
                }
            }
        </style>

        <main>
            <!-- Hero Section -->
            <section class="hero-section">
                <p class="uria">Аялаж зугаалмаар байвч хаашаа явах аа мэдэхгүй байна уу?</p>
                <h1 class="uria-h1">ХАЙ, НЭЭЖ ОЛ, <span>ХЯЛБАР ТӨЛӨВЛӨ.</span></h1>
            </section>

            <!-- Search Section -->
            <section class="search-section">
                <ag-home-search
                    areas='["Төв","Хангай","Зүүн","Баруун","Алтай","Говь"]'
                    categories='["Соёл","Амралт сувилал","Адал явдалт","Байгаль","Ууланд гарах"]'
                    area-label="Бүс нутаг"
                    cate-label="Категори">
                </ag-home-search>
            </section>

            <!-- Features Grid -->
            <section class="rec-grid">
                <ag-feature-card icon="route"  text="Уян хатан маршрут"></ag-feature-card>
                <ag-feature-card icon="people" text="Хамтдаа төлөвлө"></ag-feature-card>
                <ag-feature-card icon="signal" text="Хадгалсан маршрут"></ag-feature-card>
                <ag-feature-card icon="doc"    text="Газар нээж ол"></ag-feature-card>
            </section>

            <!-- Tutorial Section -->
            <section class="tutorial">
                <h3>АЯЛЛЫГ ИЛҮҮ ХЯЛБАРААР ЭХЛҮҮЛЬЕ.</h3>
                <div class="tutorial-grid">
                    <ag-tutorial-card
                        zrg="/assets/images/tutorial-img/tutorial-1.svg"
                        bogin="Нэг товшоод төлөвлөгөөндөө нэм."
                        urt="Сэтгэл татсан аяллын цэг бүрээ нэг товшоод маршрутдаа нэм. Аяллын төлөвлөгөө илүү ухаалаг, илүү төгс хэлбэрээр бүтээгээрэй.">
                    </ag-tutorial-card>
                    <ag-tutorial-card
                        zrg="/assets/images/tutorial-img/tutorial-2.svg"
                        bogin="Монголын үзэсгэлэнт газруудтай танилц."
                        urt="Монголын гайхамшигт байгаль, үзэсгэлэнт газруудыг нэг даруултаар нээ. Өөрийн аяллын санаагаа хамгийн хурдан байдлаар олж аваарай.">
                    </ag-tutorial-card>
                    <ag-tutorial-card
                        zrg="/assets/images/tutorial-img/tutorial-3.svg"
                        bogin="Хялбар төлөвлөгөө ба хуваалцах."
                        urt="Маршрутаа секундийн дотор бүтээгээд шууд хуваалц. Хамтын аялал зохион байгуулах хамгийн хялбар арга.">
                    </ag-tutorial-card>
                </div>
            </section>

            <!-- Featured Spots -->
            <ag-spot-section title="Шилдэг аяллын цэгүүд" link="#/spots">
                <ag-spot
                    zrg="https://lp-cms-production.imgix.net/2019-06/73598f88ed537774c53235a248ac9feb-gandan-khiid.jpg"
                    ner="Гандан Тэгчинлэн Хийд"
                    bus="Төв"
                    data-spot-id="7">
                </ag-spot>
                <ag-spot
                    zrg="https://lp-cms-production.imgix.net/2023-07/shutterstockRF567790018.jpg"
                    ner="Амарбаясгалант хийд"
                    bus="Хангай"
                    data-spot-id="2">
                </ag-spot>
                <ag-spot
                    zrg="https://lp-cms-production.imgix.net/2023-08/iStock-1218362078.jpg"
                    ner="Хустайн байгалийн цогцолборт газар"
                    bus="Төв"
                    data-spot-id="3">
                </ag-spot>
                <ag-spot
                    zrg="/assets/images/spot-img/spot04-1.jpg"
                    ner="Горхи-Тэрэлж Үндэсний Парк"
                    bus="Төв"
                    data-spot-id="4">
                </ag-spot>
            </ag-spot-section>

            <!-- Guide Banner -->
            <ag-guide-banner
                title="Хөтөч болж бүртгүүлэх"
                subtitle="Хөтөч болж өөрийн хувь нэмэрээ оруулах уу?"
                href="#/guide-signup"
                btn="Хөтөч болох">
            </ag-guide-banner>

            <!-- Cultural Spots -->
            <ag-spot-section title="Соёлын үзэсгэлэнт газрууд" link="#/spots">
                <ag-spot
                    zrg="https://lp-cms-production.imgix.net/2023-07/shutterstockRF579068047.jpg"
                    ner="Эрдэнэзуу хийд"
                    bus="Хангай"
                    data-spot-id="11">
                </ag-spot>
                <ag-spot
                    zrg="/assets/images/spot-img/spot02-1.jpg"
                    ner="Амарбаясгалант хийд"
                    bus="Хангай"
                    data-spot-id="2">
                </ag-spot>
                <ag-spot
                    zrg="/assets/images/spot-img/spot07-1.jpg"
                    ner="Гандан Тэгчинлэн Хийд"
                    bus="Төв"
                    data-spot-id="7">
                </ag-spot>
                <ag-spot
                    zrg="/assets/images/spot-img/spot08-1.jpg"
                    ner="Богд хан уул"
                    bus="Төв"
                    data-spot-id="8">
                </ag-spot>
            </ag-spot-section>

            <!-- Nature Spots -->
            <ag-spot-section title="Байгалийн үзэсгэлэнт газрууд" link="#/spots">
                <ag-spot
                    zrg="/assets/images/spot-img/spot03-1.jpg"
                    ner="Хустайн байгалийн цогцолборт газар"
                    bus="Төв"
                    data-spot-id="3">
                </ag-spot>
                <ag-spot
                    zrg="/assets/images/spot-img/spot13-1.jpg"
                    ner="Тэрхийн цагаан нуур"
                    bus="Хангай"
                    data-spot-id="13">
                </ag-spot>
                <ag-spot
                    zrg="/assets/images/spot-img/spot14-1.jpg"
                    ner="Алтай Таван богд"
                    bus="Алтай"
                    data-spot-id="14">
                </ag-spot>
                <ag-spot
                    zrg="/assets/images/spot-img/spot09-1.jpg"
                    ner="Хөвсгөл нуур"
                    bus="Хангай"
                    data-spot-id="9">
                </ag-spot>
            </ag-spot-section>
        </main>
        `;
    }

    attachEventListeners() {
        // Handle clicks on ag-spot elements
        this.addEventListener('click', (e) => {
            const spot = e.target.closest('ag-spot');
            if (!spot) return;

            const spotId = spot.getAttribute('data-spot-id');
            if (!spotId) return;

            // Check if the click was on the add button (inside shadow DOM)
            // We need to check the original event target's composition path
            const path = e.composedPath();
            const isAddButton = path.some(el =>
                el.tagName === 'BUTTON' &&
                el.getAttribute?.('aria-label') === 'Маршрутдаа нэмэх'
            );

            if (isAddButton) {
                // Add to plan
                e.preventDefault();
                e.stopPropagation();

                const result = window.appState.addToPlan(spotId);

                if (result === true) {
                    // Successfully added - show success feedback
                    const button = path.find(el =>
                        el.tagName === 'BUTTON' &&
                        el.getAttribute?.('aria-label') === 'Маршрутдаа нэмэх'
                    );
                    if (button) {
                        // Visual feedback
                        button.style.backgroundColor = 'var(--accent-3)';
                        setTimeout(() => {
                            button.style.backgroundColor = '';
                        }, 500);
                    }

                    // Show success toast notification
                    if (this.toast) {
                        this.toast.show('Төлөвлөгөөнд нэмэгдлээ!', 'success', 3000);
                    }
                } else if (result === 'exists') {
                    // Already exists - show info toast
                    if (this.toast) {
                        this.toast.show('Энэ газар аль хэдийн төлөвлөгөөнд байна', 'info', 3000);
                    }
                }
            } else {
                // Navigate to spot info page
                window.appState.setCurrentSpot(spotId);
                window.location.hash = '#/spot-info';
            }
        });
    }
}

customElements.define('ag-page-home', PageHome);
