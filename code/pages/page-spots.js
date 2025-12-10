class PageSpots extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.innerHTML = `
            <section id="spots-section">
                <h2 class="section-title">Аяллын цэгүүд</h2>
                <div style="display: grid; grid-template-columns: 250px 1fr; gap: 2rem;">
                    <aside class="filter-aside">
                        <h3>Аяллын цэг хайх</h3>
                        <section class="filter-section">
                            <ag-filter ner="Категори" turul1="Соёл" turul2="Амралт сувилал" turul3="Адал явдалт" turul4="Байгаль"
                                turul5="Ууланд гарах"></ag-filter>
                            <ag-filter ner="Бүс нутаг" turul1="Алтай" turul2="Баруун" turul3="Говь" turul4="Зүүн" turul5="Хангай"
                                turul6="Төв"></ag-filter>
                        </section>
                    </aside>
                    <div>
                        <ag-spot-manager></ag-spot-manager>
                        <p class="container-hdr">Аяллын цэгүүд</p>
                        <div class="spots-grid">
                            <ag-spot-card
                                zrg="https://lp-cms-production.imgix.net/2023-07/shutterstockRF567790018.jpg"
                                bus="төв"
                                unelgee="4.3"
                                ner="Амарбаясгалант хийд"
                                cate="Соёл"
                                activity="Түүхэн"
                                une="Үнэгүй"
                                age="Бүх нас"
                                data-spot-id="amarbayasgalant">
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

                            <ag-spot-card
                                zrg="https://lp-cms-production.imgix.net/2023-08/iStock-1218362078.jpg"
                                bus="төв"
                                unelgee="4.5"
                                ner="хустайн байгалийн цогцолбор"
                                cate="Байгаль"
                                une="500,000"
                                activity="Морин аялал, Сур харваа"
                                age="Бүх нас"
                                data-spot-id="khustai">
                            </ag-spot-card>

                            <ag-spot-card
                                zrg="https://lp-cms-production.imgix.net/2019-06/870d8d6123525e17e6a4c9d34b14f8c7-chinggis-khaan-sukhbaatar-square.jpg"
                                bus="төв"
                                unelgee="4.0"
                                ner="Сүхбаатарын талбай"
                                cate="Түүхэн, Соёл"
                                une="Үнэгүй"
                                age="Бүх нас"
                                data-spot-id="sukhbaatar">
                            </ag-spot-card>
                        </div>
                    </div>
                </div>
            </section>
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
