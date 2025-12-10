class PageHome extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.innerHTML = `
        <style>
            :host {
                display: block;
                width: 100%;
            }

            main {
                width: 100%;
                max-width: 100vw;
                display: flex;
                flex-direction: column;
                align-items: center;
                animation: fadeIn 0.6s ease-out;
                gap: var(--gap-size-m);
                padding: 0;
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
                        zrg="../files/tutorial-img/tutorial-1.svg"
                        bogin="Нэг товшоод төлөвлөгөөндөө нэм."
                        urt="Сэтгэл татсан аяллын цэг бүрээ нэг товшоод маршрутдаа нэм. Аяллын төлөвлөгөө илүү ухаалаг, илүү төгс хэлбэрээр бүтээгээрэй.">
                    </ag-tutorial-card>
                    <ag-tutorial-card
                        zrg="../files/tutorial-img/tutorial-2.svg"
                        bogin="Монголын үзэсгэлэнт газруудтай танилц."
                        urt="Монголын гайхамшигт байгаль, үзэсгэлэнт газруудыг нэг даруултаар нээ. Өөрийн аяллын санаагаа хамгийн хурдан байдлаар олж аваарай.">
                    </ag-tutorial-card>
                    <ag-tutorial-card
                        zrg="../files/zaavar3.svg"
                        bogin="Хялбар төлөвлөгөө ба хуваалцах."
                        urt="Маршрутаа секундийн дотор бүтээгээд шууд хуваалц. Хамтын аялал зохион байгуулах хамгийн хялбар арга.">
                    </ag-tutorial-card>
                </div>
            </section>

            <!-- Featured Spots -->
            <ag-spot-section title="Шилдэг аяллын цэгүүд" link="#/spots">
                <ag-spot
                    zrg="https://lp-cms-production.imgix.net/2019-06/870d8d6123525e17e6a4c9d34b14f8c7-chinggis-khaan-sukhbaatar-square.jpg"
                    ner="СҮХБААТАРЫН ТАЛБАЙ"
                    bus="Төв"
                    data-spot-id="sukhbaatar">
                </ag-spot>
                <ag-spot
                    zrg="https://lp-cms-production.imgix.net/2019-06/73598f88ed537774c53235a248ac9feb-gandan-khiid.jpg"
                    ner="Гандан Тэгчинлэн Хийд"
                    bus="Төв"
                    data-spot-id="gandan">
                </ag-spot>
                <ag-spot
                    zrg="https://lp-cms-production.imgix.net/2023-07/shutterstockRF567790018.jpg"
                    ner="Амарбаясгалант хийд"
                    bus="Төв"
                    data-spot-id="amarbayasgalant">
                </ag-spot>
                <ag-spot
                    zrg="https://lp-cms-production.imgix.net/2023-08/iStock-1218362078.jpg"
                    ner="Хустайн байгалийн цогцолбор"
                    bus="Төв"
                    data-spot-id="khustai">
                </ag-spot>
            </ag-spot-section>

            <!-- Guide Banner -->
            <ag-guide-banner
                title="Хөтөч болж бүртгүүлэх"
                subtitle="Хөтөч болж өөрийн хувь нэмэрээ оруулах уу?"
                href="../code/guide_sign_up.html"
                btn="Хөтөч болох">
            </ag-guide-banner>

            <!-- Cultural Spots -->
            <ag-spot-section title="Соёлын үзэсгэлэнт газрууд" link="#/spots">
                <ag-spot
                    zrg="https://lp-cms-production.imgix.net/2023-07/shutterstockRF579068047.jpg"
                    ner="Эрдэнэ Зуу хийд"
                    bus="Хангай"
                    data-spot-id="erdenezuu">
                </ag-spot>
                <ag-spot
                    zrg="https://lp-cms-production.imgix.net/2023-08/shutterstock668674942.jpg"
                    ner="Аглаг бүтээлийн хийд"
                    bus="Төв"
                    data-spot-id="aglag">
                </ag-spot>
                <ag-spot
                    zrg="https://lp-cms-production.imgix.net/2023-08/iStock-1218476559.jpg"
                    ner="Шанхын хийд"
                    bus="Хангай"
                    data-spot-id="shankh">
                </ag-spot>
                <ag-spot
                    zrg="https://lp-cms-production.imgix.net/2023-07/shutterstock743550031.jpg"
                    ner="Богд Хааны Ордон Музей"
                    bus="Төв"
                    data-spot-id="bogdkhan">
                </ag-spot>
            </ag-spot-section>

            <!-- Nature Spots -->
            <ag-spot-section title="Байгалийн үзэсгэлэнт газрууд" link="#/spots">
                <ag-spot
                    zrg="https://lp-cms-production.imgix.net/2023-08/iStock-1218362078.jpg"
                    ner="Хустайн байгалийн цогцолбор"
                    bus="Төв"
                    data-spot-id="khustai">
                </ag-spot>
                <ag-spot
                    zrg="https://lp-cms-production.imgix.net/2023-05/iStock-178959041.jpg"
                    ner="Тэрхийн Цагаан нуур"
                    bus="Хангай"
                    data-spot-id="terkhiin">
                </ag-spot>
                <ag-spot
                    zrg="https://montsame.mn/files/667399f904664.jpeg"
                    ner="Алтай Таван Богд"
                    bus="Баруун"
                    data-spot-id="altai">
                </ag-spot>
                <ag-spot
                    zrg="https://resource4.sodonsolution.org/24tsag/image/2023/04/11/lsjspaux9r6jwurn/%D0%9D%D2%AF%D2%AF%D0%B4%D0%BB%D0%B8%D0%B9%D0%BD%20%D1%88%D1%83%D0%B2%D1%83%D1%83%D0%B4%20%D0%B8%D1%80%D0%BB%D1%8D%D1%8D.jpg"
                    ner="Ганга нуур"
                    bus="Зүүн"
                    data-spot-id="ganga">
                </ag-spot>
            </ag-spot-section>
        </main>
        `;
    }

    attachEventListeners() {
        // Handle spot clicks - navigate to spot info
        this.addEventListener('click', (e) => {
            const spot = e.target.closest('ag-spot');
            if (spot) {
                const spotId = spot.getAttribute('data-spot-id');
                if (spotId) {
                    window.appState.setCurrentSpot(spotId);
                    window.location.hash = '#/spot-info';
                }
            }
        });
    }
}

customElements.define('page-home', PageHome);
