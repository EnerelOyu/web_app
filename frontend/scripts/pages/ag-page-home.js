class PageHome extends HTMLElement {
    
    constructor() {
        super();
    }

    connectedCallback() {
        this.attachShadow({ mode: 'open' }); 
        this.render();
        this.setupToast();
        this.attachEventListeners();
    }

    //plan -д spot нэмэгдсэн амжилт/алдааны мэдэгдэл харуулахад ашиглана
    setupToast() {
        // Toast элемент байхгүй бол шинээр үүсгэх
        if (!document.querySelector('ag-toast')) {
            const toast = document.createElement('ag-toast');
            document.body.appendChild(toast);
        }
        this.toast = document.querySelector('ag-toast');
    }

    render() {
        this.shadowRoot.innerHTML = `
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
                bottom: -0.3rem;
                left: 0;
                width: 0;
                height: 0.2rem;
                background-color: var(--secondary);
                transition: width 0.5s ease;
            }

            .uria-h1:hover span::after {
                width: 100%;
            }

            /* Search Section */
            .search-section {
                width: 100%;
                max-width: 90%;
                display: flex;
                justify-content: center;
                padding: var(--p-lg) 0;
            }

            /* Features Grid */
            .rec-grid {
                width: 100%;
                max-width: 85%;
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: var(--gap-size-m);
                padding: var(--p-xl) 0;
            }

            /* Tutorial Section */
            .tutorial {
                width: 100%;
                max-width: 90%;
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
                max-width: 95%;
                padding: var(--p-xl) 2%;
            }

            /* Guide Banner */
            ag-guide-banner {
                width: 100%;
                padding: 0;
            }

            /* =========================
               MOBILE LANDSCAPE (481px - 768px - гар утасны хэвтээ)
               ========================= */
            @media (max-width: 768px) and (min-width: 481px) {
                main {
                    gap: var(--gap-size-l);
                    padding: var(--p-xl) 0;
                }

                .hero-section {
                    padding: var(--p-xl) 0;
                }

                .search-section {
                    max-width: 95%;
                    padding: var(--p-md) 0;
                }

                .uria {
                    font-size: var(--fs-lg);
                    padding: var(--p-sm) 0;
                }

                .uria-h1 {
                    font-size: var(--fs-2xl);
                    padding: var(--p-md) 0;
                }

                .rec-grid {
                    grid-template-columns: repeat(2, 1fr);
                    max-width: 90%;
                    gap: 0;
                }

                .tutorial {
                    max-width: 95%;
                }

                .tutorial h3 {
                    font-size: var(--fs-lg);
                }

                .tutorial-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: var(--gap-size-m);
                }

                ag-spot-section {
                    max-width: 95%;
                }
            }

            /* MOBILE (≤480px - гар утасны босоо) */
            @media (max-width: 480px) {
                main {
                    gap: var(--gap-size-m);
                    padding: var(--p-md) 0;
                }

                .hero-section {
                    padding: var(--p-lg) 0;
                    gap: var(--gap-size-s);
                }

                .search-section {
                    max-width: 100%;
                    padding: var(--p-sm) 0;
                }

                .uria {
                    font-size: var(--fs-base);
                    padding: var(--p-sm) 0;
                }

                .uria-h1 {
                    font-size: var(--fs-lg);
                    padding: var(--p-sm) 0;
                }

                .rec-grid {
                    grid-template-columns: 1fr;
                    max-width: 90%;
                    gap: var(--gap-size-m);
                }

                .tutorial {
                    max-width: 95%;
                    padding: var(--p-xl) 0;
                }

                .tutorial h3 {
                    font-size: var(--fs-base);
                }

                .tutorial-grid {
                    grid-template-columns: 1fr;
                    gap: var(--gap-size-m);
                }

                ag-spot-section {
                    max-width: 100%;
                    padding: var(--p-md) 0;
                }

                ag-guide-banner {
                    max-width: 100%;
                    padding: var(--p-lg) 0;
                }
            }
        </style>

        <main>
            <!-- Hero Section -->
            <section class="hero-section">
                <p class="uria">Аялаж зугаалмаар байвч хаашаа явах аа мэдэхгүй байна уу?</p>
                <h1 class="uria-h1">ХАЙ, НЭЭЖ ОЛ, <span>ХЯЛБАР ТӨЛӨВЛӨ.</span></h1>
            </section>

            <!-- Хайлтын Section -->
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
            <ag-spot-section title="Шилдэг аяллын цэгүүд" link="#/spots?rating=5">
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
            <ag-spot-section title="Соёлын үзэсгэлэнт газрууд" link="#/spots?cate=Соёл">
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
            <ag-spot-section title="Байгалийн үзэсгэлэнт газрууд" link="#/spots?cate=Байгаль">
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

    /* ag-spot дээр дарах үйлдлүүдийг удирдана:
     * - Газрын мэдээлэл үзэх
     * - Төлөвлөгөөнд нэмэх
     */
    attachEventListeners() {
        // ag-spot элементүүд дээрх дарах үйлдлийг боловсруулах
        this.shadowRoot.addEventListener('click', (e) => {
            // Дарагдсан spot элементийг олох
            const spot = e.target.closest('ag-spot');
            if (!spot) return;

            // Spot-ын ID авах
            const spotId = spot.getAttribute('data-spot-id');
            if (!spotId) return;

            // Shadow DOM доторх "Нэмэх" товч дээр дарсан эсэхийг шалгах
            // composedPath() ашиглан бүх элементүүдийг шалгана
            const path = e.composedPath();
            const isAddButton = path.some(el =>
                el.tagName === 'BUTTON' &&
                el.getAttribute?.('aria-label') === 'Маршрутдаа нэмэх'
            );

            if (isAddButton) {
                // Төлөвлөгөөнд нэмэх үйлдэл
                e.preventDefault();
                e.stopPropagation();

                // Spot-г төлөвлөгөөнд нэмэх
                const result = window.appState.addToPlan(spotId);

                if (result === true) {
                    // Амжилттай нэмэгдсэн - амжилтын мэдэгдэл харуулах
                    const button = path.find(el =>
                        el.tagName === 'BUTTON' &&
                        el.getAttribute?.('aria-label') === 'Маршрутдаа нэмэх'
                    );
                    if (button) {
                        // Товчны өнгө түр өөрчлөх (харааны пиидбэк)
                        button.style.backgroundColor = 'var(--accent-3)';
                        setTimeout(() => {
                            button.style.backgroundColor = '';
                        }, 500);
                    }

                    // Амжилтын toast мэдэгдэл харуулах
                    if (this.toast) {
                        this.toast.show('Төлөвлөгөөнд нэмэгдлээ!', 'success', 3000);
                    }
                } else if (result === 'exists') {
                    // Аль хэдийн байгаа - мэдээллийн toast харуулах
                    if (this.toast) {
                        this.toast.show('Энэ газар аль хэдийн төлөвлөгөөнд байна', 'info', 3000);
                    }
                }
            } else {
                // Spot-ын дэлгэрэнгүй мэдээлэл рүү шилжих
                window.appState.setCurrentSpot(spotId);
                window.location.hash = `#/spot-info?spotId=${spotId}`;
            }
        });
    }
}

customElements.define('ag-page-home', PageHome);
