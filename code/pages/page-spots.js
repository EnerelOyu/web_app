class PageSpots extends HTMLElement {
    constructor() {
        super();
        this.css=`
        @import url('fonts.css');
            *,
            *::before,
            *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            }

            h1, h2, h3, h4 {
            font-family: 'Rubik';
            }

            p {
            font-family: 'NunitoSans';
            }

            body {
            font-family: 'NunitoSans';
            color: var(--text-color-1);
            background-color: var(--bg-color);
            }

            /* Page fade-in */
            main {
            display: grid;
            grid-template-columns: 1fr 3fr;
            animation: fadeInPage 0.6s ease-out;
            }

            /* =============== FILTER ASIDE (Desktop) =============== */

            .filter-aside {
            position: sticky;
            top: 0;
            align-self: flex-start;

            display: flex;
            flex-direction: column;
            justify-content: flex-start;

            padding: var(--p-md) var(--p-xl);
            box-shadow: 1px 0 10px 2px var(--text-color-6);
            background-color: var(--bg-color);

            animation: slideInLeft 0.7s ease-out;
            }

            .filter-aside h2 {
            color: var(--text-color-1);
            padding-bottom: var(--p-sm);
            font-size: var(--fs-xl);
            text-transform: uppercase;
            }


            .filter-section {
            display: flex;
            flex-direction: column;
            gap: var(--gap-size-m);
            }

            /* =============== SPOT GRID SECTION =============== */

            .spot-cards-container {
            height: 100vh;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: var(--gap-size-m);
            padding: var(--p-md) var(--p-xl);
            }

            .spot-cards-container a:link {
            text-decoration: none;
            }

            .container-hdr {
            color: var(--text-color-1);
            font-size: var(--fs-base);
            text-align: right;
            text-transform: uppercase;
            }

            .spots-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--gap-size-m);
            }

            /* Card fade-up animation */
            .spot-card {
            opacity: 0;
            transform: translateY(15px);
            animation: cardFadeUp 0.5s ease-out forwards;
            }

            /* Жаахан stagger эффект */
            .spots-grid .spot-card:nth-child(1) { animation-delay: 0.05s; }
            .spots-grid .spot-card:nth-child(2) { animation-delay: 0.1s; }
            .spots-grid .spot-card:nth-child(3) { animation-delay: 0.15s; }
            .spots-grid .spot-card:nth-child(4) { animation-delay: 0.2s; }
            .spots-grid .spot-card:nth-child(5) { animation-delay: 0.25s; }
            .spots-grid .spot-card:nth-child(6) { animation-delay: 0.3s; }

            /* Rating UI */
            .rating {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: var(--gap-size-xs);
            }

            .readOnly-rating-stars {
            display: inline-flex;
            }

            .readOnly-rating-stars .star {
            width: var(--svg-s);
            height: var(--svg-s);
            display: block;
            color: var(--accent-1);
            }

            .rating .rating-num {
            font-family: 'NunitoSans';
            font-size: var(--fs-sm);
            color: var(--accent-1);
            }

            /* =============== LOADING SHIMMER =============== */

            @keyframes shimmer {
            0% {
                background-position: -1000px 0;
            }
            100% {
                background-position: 1000px 0;
            }
            }

            .loading {
            animation: shimmer 2s infinite;
            background: linear-gradient(
                to right,
                var(--accent-9) 0%,
                var(--accent-8) 20%,
                var(--accent-9) 40%,
                var(--accent-9) 100%
            );
            background-size: 1000px 100%;
            }

            /* =============== KEYFRAMES (page/filter/cards) =============== */

            @keyframes fadeInPage {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
            }

            @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
            }

            @keyframes cardFadeUp {
            from {
                opacity: 0;
                transform: translateY(15px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
            }

            /* =========================================================
            ===============  TABLET  ≤ 1024px ========================
            ========================================================= */

            @media (max-width: 1024px) {

            main {
                grid-template-columns: 1fr;
            }

            .filter-aside {
                position: sticky;
                top: 0;
                z-index: 20;

                flex-direction: row;
                align-items: center;
                gap: var(--gap-size-m);

                padding: var(--p-sm) var(--p-lg);
                background-color: var(--bg-color);
                box-shadow: 0 2px 10px rgba(0,0,0,0.06);
                backdrop-filter: blur(8px);
            }

            .filter-aside h2 {
                margin: 0;
                font-size: var(--fs-base);
                white-space: nowrap;
            }

            .filter-section {
                flex: 1;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                gap: var(--gap-size-s);
                overflow-x: auto;
                padding-bottom: var(--p-xs);
                scrollbar-width: none;
            }

            .filter-section::-webkit-scrollbar {
                display: none;
            }

            .filter-section ag-filter {
                flex: 0 0 auto;
                min-width: max-content;
            }

            .spot-cards-container {
                height: auto;
                overflow-y: visible;
                padding: var(--p-md) var(--p-lg);
            }

            .spots-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: var(--gap-size-m);
            }

            .container-hdr {
                text-align: left;
                margin-bottom: var(--m-sm);
            }
            }

            /* =========================================================
            ==================  MOBILE  ≤ 768px ======================
            ========================================================= */

            @media (max-width: 768px) {

            .filter-aside {
                padding: var(--p-xs) var(--p-md);
                gap: var(--gap-size-s);
                flex-direction: column;
                align-items: flex-start;
            }

            .filter-aside h2 {
                font-size: var(--fs-lg);
            }

            .filter-section {
                width: 100%;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                gap: var(--gap-size-s);
                overflow-x: auto;
                padding-bottom: var(--p-xs);
                scrollbar-width: none;
            }

            .filter-section::-webkit-scrollbar {
                display: none;
            }

            .filter-section ag-filter {
                flex: 0 0 auto;
                min-width: calc(50% - var(--gap-size-s));
            }

            .spot-cards-container {
                padding: var(--p-sm) var(--p-md);
            }

            .spots-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: var(--gap-size-m);
            }

            .spot-card {
                padding: var(--p-sm);
            }

            .spot-info h3,
            .spot-card:hover .spot-info h3 {
                font-size: var(--fs-base);
            }

            .tags li {
                font-size: var(--fs-xs);
                padding: var(--p-xxs);
            }

            .rating .rating-num {
                font-size: var(--fs-xs);
            }
            }
        `;
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.innerHTML = `
            <style>${this.css}</style>
            <main>
            <aside class="filter-aside">
                <h2>Аяллын цэг хайх</h2>
                <section class="filter-section">
                    <ag-filter ner="Категори" turul1="Соёл" turul2="Амралт сувилал" turul3="Адал явдалт" turul4="Байгаль"
                        turul5="Ууланд гарах"></ag-filter>
                    <ag-filter ner="Бүс нутаг" turul1="Алтай" turul2="Баруун" turul3="Говь" turul4="Зүүн" turul5="Хангай"
                        turul6="Төв"></ag-filter>
                    <ag-filter ner="Үйл ажиллагаа" turul1="Амьтантай ойр" turul2="Говьд тэмээ унах" turul3="Түүхэн"
                        turul4="Морин аялал" turul5="Сур харваа" turul6=""></ag-filter>
                    <ag-filter ner="Насны ангилал" turul1="18-аас бага" turul2="18–25" turul3="26–45" turul4="46-аас их"
                        turul5="Бүх нас" turul6=""></ag-filter>
                </section>
            </aside>
            <div class="spot-cards-container">
                <ag-spot-manager></ag-spot-manager>
                <p class="container-hdr">шүүсэн аяллын цэгүүд</p>
                <div class="spots-grid">
                    <ag-spot-card
                        href="../code/spot-info.html" ,
                        zrg="https://lp-cms-production.imgix.net/2023-07/shutterstockRF1229637994.jpg" ,
                        bus="төв",
                        unelgee="4.5",
                        ner="Цонжин Болдог",
                        cate="Соёл",
                        activity="Морин аялал, Амьтантай ойр",
                        une="20,000",
                        age="Бүх нас"
                        data-spot-id="tsonjin">
                    </ag-spot-card>



                    <ag-spot-card
                        href="../code/spot-info.html",
                        zrg="https://lp-cms-production.imgix.net/2023-07/shutterstockRF567790018.jpg",
                        bus="төв" ,
                        unelgee="4.3",
                        ner="Амарбаясгалант хийд",
                        cate="Соёл",
                        activity="Түүхэн",
                        une="Үнэгүй",
                        age="Бүх нас"
                        data-spot-id="amarbayasgalant">
                    </ag-spot-card>

                    <ag-spot-card
                        href="../code/spot-info.html" ,
                        zrg="https://lp-cms-production.imgix.net/2023-08/iStock-1218362078.jpg",
                        bus="төв" ,
                        unelgee="4.5",
                        ner="хустайн байгалийн цогцолбор",
                        cate="Байгаль",
                        une="500,000",
                        activity="Морин аялал, Сур харваа",
                        age="Бүх нас"
                        data-spot-id="khustai">
                    </ag-spot-card>

                    <ag-spot-card
                        href="../code/spot-info.html" ,
                        zrg="https://montsame.mn/files/667399f904664.jpeg" ,
                        bus="Алтай" ,
                        unelgee="4.5" ,
                        ner="Алтай Таван Богд" ,
                        cate="Байгаль ,Амралт сувилал" ,
                        une="100,000"
                        data-spot-id="altai">
                    </ag-spot-card>

                    <ag-spot-card
                        href="../code/spot-info.html" ,
                        zrg="https://resource4.sodonsolution.org/24tsag/image/2023/04/11/lsjspaux9r6jwurn/%D0%9D%D2%AF%D2%AF%D0%B4%D0%BB%D0%B8%D0%B9%D0%BD%20%D1%88%D1%83%D0%B2%D1%83%D1%83%D0%B4%20%D0%B8%D1%80%D0%BB%D1%8D%D1%8D.jpg"
                        bus="Зүүн" ,
                        unelgee="3" ,
                        ner="ганга нуур" ,
                        cate="Байгаль, Амралт сувилал" ,
                        une="20,000"
                        data-spot-id="ganga">
                    </ag-spot-card>

                    <ag-spot-card
                        href="../code/spot-info.html" ,
                        zrg="https://lp-cms-production.imgix.net/2023-08/iStock-1427612316.jpg" ,
                        bus="Баруун" ,
                        unelgee="3.0" ,
                        ner="Монгол Элс" ,
                        cate="Байгаль" ,
                        une="33,000"
                        data-spot-id="mongolels">
                    </ag-spot-card>

                    <ag-spot-card
                        href="../code/spot-info.html" ,
                        zrg="https://lp-cms-production.imgix.net/2023-06/iStock-513683766.jpg" ,
                        bus="Хангай" ,
                        unelgee="5.00" ,
                        ner="хөвсгөл нуур" ,
                        cate="Байгаль, Амралт сувилал" ,
                        une="15,000"
                        data-spot-id="khovsgol">
                    </ag-spot-card>

                    <ag-spot-card
                        href="../code/spot-info.html" ,
                        zrg="http://www.newkhovd.mn/news-images/%D0%BC-05.jpg_medium.jpg" ,
                        bus="Хангай" ,
                        unelgee="5.00" ,
                        ner="Мөнххайрхан уул" ,
                        cate="Байгаль, Амралт сувилал, ууланд гарах" ,
                        une="25,000"
                        data-spot-id="munkhkhairkhan">
                    </ag-spot-card>

                </div>
            </div>

        </main>
        `;
    }

    attachEventListeners() {
        // Handle spot card clicks
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
    }
}

customElements.define('page-spots', PageSpots);
