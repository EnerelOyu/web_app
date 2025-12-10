class PageSpotInfo extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();

        // Listen for state changes
        window.addEventListener('appstatechange', (e) => {
            if (e.detail.key === 'currentSpot') {
                this.render();
                this.attachEventListeners();
            }
        });
    }

    render() {
        const spot = window.appState.currentSpot || window.appState.getSpot('amarbayasgalant');

        this.innerHTML = `
            <section id="spot-info-section" class="spot-info-section">
                <h2 class="section-title">Аяллын цэгийн дэлгэрэнгүй</h2>
                <div class="main-container">
                    <div class="spot-main">
                        <ag-spot-hero
                            id="current-spot-hero"
                            title="${spot.title}"
                            rating="${spot.rating}"
                            cate="${spot.cate}"
                            status="${spot.status}"
                            time="${spot.time}"
                            img1="${spot.img1}"
                            img2="${spot.img2}"
                            img3="${spot.img3}"
                            data-spot-id="${spot.id}"
                        ></ag-spot-hero>
                        <ag-spot-aside
                            map-src="../files/Mongolia_blank.svg"
                            region="${spot.region}"
                            location="${spot.location}"
                            age="${spot.age}"
                            price="${spot.price}"
                            schedule="${spot.schedule}"
                        ></ag-spot-aside>
                    </div>
                    <div class="spot-details">
                        <section class="intro">
                            <h3>Танилцуулга</h3>
                            <p>${spot.description}</p>
                        </section>
                    </div>
                </div>
            </section>
        `;
    }

    attachEventListeners() {
        // Handle add button clicks
        this.addEventListener('click', (e) => {
            const spotHero = e.target.closest('ag-spot-hero');
            if (spotHero) {
                const addButton = e.target.closest('.action-btn');
                if (addButton && addButton.textContent.includes('Нэмэх')) {
                    e.preventDefault();

                    const spotId = spotHero.getAttribute('data-spot-id');
                    if (spotId) {
                        const success = window.appState.addToPlan(spotId);

                        if (success) {
                            // Visual feedback
                            const originalHTML = addButton.innerHTML;
                            addButton.innerHTML = '<span>Нэмсэн!</span>';
                            addButton.style.background = 'var(--accent-2)';

                            setTimeout(() => {
                                addButton.innerHTML = originalHTML;
                                addButton.style.background = '';
                            }, 1500);

                            // Navigate to plan
                            setTimeout(() => {
                                window.location.hash = '#/plan';
                            }, 600);
                        }
                    }
                }
            }
        });
    }
}

customElements.define('page-spot-info', PageSpotInfo);
