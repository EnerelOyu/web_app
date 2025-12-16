class PageSpotInfo extends HTMLElement {
  constructor() {
    super();

    // spot-info.css-ийг компонент дотроо scope-лосон хувилбар
    this.css = `
      .page-spot-info {
        display: flex;
        flex-direction: column;
        gap: var(--m-xl);
        margin: var(--m-md);
      }

      .page-spot-info .spot-main {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--gap-size-m);
        align-items: flex-start;
      }

      /* SECTION TITLE */

      .page-spot-info h3 {
        font-size: var(--fs-lg);
        text-transform: uppercase;
        font-family: 'Rubik';
        font-weight: 100;
        color: var(--text-color-2);
        margin-bottom: var(--m-sm);
      }

      /* INTRO SECTION */

      .page-spot-info .spot-details {
        display: flex;
        flex-direction: column;
        gap: var(--m-xl);
      }

      .page-spot-info .intro {
        display: flex;
        flex-direction: column;
        gap: var(--m-sm);
      }

      .page-spot-info .intro p {
        padding: var(--p-xs);
        border-radius: var(--br-m);
        background: var(--bg-color);
        border: 2px solid var(--text-color-8);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        margin: 0 var(--m-lg);
        line-height: 1.6;
        font-family: 'NunitoSans';
      }

      /* GUIDE & REVIEW HORIZONTAL SCROLL SECTIONS */

      .page-spot-info .guide-section,
      .page-spot-info .review-section {
        display: flex;
        flex-direction: column;
        gap: var(--m-sm);
      }

      .page-spot-info .guide-scroll-container {
        position: relative;
        display: grid;
        justify-content: center;
        align-items: center;
      }

      .page-spot-info .guides,
      .page-spot-info .reviews {
        display: flex;
        gap: var(--gap-size-m);
        overflow-x: auto;
        scroll-behavior: smooth;
        margin: 0 var(--m-lg);
        padding: var(--p-xs) 0;
      }

      .page-spot-info .guides::-webkit-scrollbar,
      .page-spot-info .reviews::-webkit-scrollbar {
        display: none;
      }

      .page-spot-info .guides a:link,
      .page-spot-info .guides a:visited,
      .page-spot-info .reviews a:link,
      .page-spot-info .reviews a:visited {
        text-decoration: none;
      }

      /* =====================================================
             SCROLL BUTTONS (Left / Right)
         ===================================================== */

      .page-spot-info .scrl {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 3;
        width: var(--svg-m);
        height: var(--svg-m);
        border: none;
        border-radius: var(--br-circle);
        background-color: var(--primary-5);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: background-color 200ms ease;
        padding: var(--p-xs);
      }

      .page-spot-info .scrl:hover {
        background-color: var(--primary);
        opacity: 1;
      }

      .page-spot-info .scrl svg {
        width: var(--svg-m);
        height: var(--svg-m);
        fill: var(--primary);
        opacity: 0.9;
        transition: fill 200ms ease, opacity 200ms ease;
      }

      .page-spot-info .scrl:hover svg {
        fill: var(--primary-5);
        opacity: 1;
      }

      .page-spot-info .scrl-left {
        left: 0;
      }

      .page-spot-info .scrl-right {
        right: 0;
      }

      .page-spot-info .more-guides {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        margin-left: auto;
        margin-right: var(--m-xl);
        gap: var(--gap-size-s);
        color: var(--text-color-2);
        font-size: var(--fs-sm);
      }

      .page-spot-info .more-guides p {
        font-family: 'NunitoSans';
      }

      .page-spot-info .more-guides:link,
      .page-spot-info .more-guides:visited {
        text-decoration: none;
      }

      .page-spot-info .more-icon {
        width: var(--svg-s);
        height: var(--svg-s);
        color: var(--text-color-2);
        transition: transform 0.2s ease;
      }

      .page-spot-info .more-guides:hover .more-icon {
        transform: translateX(4px);
      }

      .page-spot-info .more-spots {
        display: flex;
        justify-content: flex-end;
        margin-left: auto;
        margin-right: var(--m-xl);
        align-items: center;
        gap: var(--gap-size-s);
      }

      /* =====================================================
             REVIEW CARD (Used inside ag-review-card)
         ===================================================== */

      .page-spot-info .review-card {
        display: flex;
        flex-direction: column;
        gap: var(--p-md);
        padding: var(--p-lg);
        border-radius: var(--br-m);
        background: var(--bg-color);
        border: 2px solid var(--text-color-8);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        font-family: 'NunitoSans';
        align-items: flex-start;
        color: var(--text-color-2);
      }

      .page-spot-info .brief-review {
        text-transform: uppercase;
      }

      /* =====================================================
                          RESPONSIVE
         ===================================================== */

      @media (max-width: 960px) {
        .page-spot-info {
          margin: var(--m-sm);
        }

        .page-spot-info .spot-main {
          grid-template-columns: 1fr;
        }

        .page-spot-info .intro p,
        .page-spot-info .guides,
        .page-spot-info .reviews {
          margin: 0 var(--m-sm);
        }

        .page-spot-info .more-guides,
        .page-spot-info .more-spots {
          margin-right: var(--m-md);
        }
      }

      @media (max-width: 600px) {
        .page-spot-info .scrl {
          display: none;
        }
      }
    `;
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();

    // appState дотор currentSpot солигдоход реактив болгоно
    window.addEventListener("appstatechange", (e) => {
      if (e.detail.key === "currentSpot") {
        this.render();
        this.attachEventListeners();
      }
    });
  }

  render() {
    const spot =
      window.appState.currentSpot ||
      window.appState.getSpot("amarbayasgalant");

    this.innerHTML = `
      <style>${this.css}</style>
      <section class="page-spot-info">
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
            map-src="${spot.mapSrc || '../files/Mongolia_blank.svg'}"
            region="${spot.region}"
            location="${spot.location}"
            age="${spot.age}"
            price="${spot.price}"
            schedule="${spot.schedule}"
          ></ag-spot-aside>
        </div>

        <div class="spot-details">
          <!-- Танилцуулга -->
          <section class="intro">
            <h3>Танилцуулга</h3>
            <p>${spot.description}</p>
          </section>

          <!-- Санал болгох хөтөч -->
          <section class="guide-section">
            <h3>Санал болгох хөтөч</h3>
            <div class="guide-scroll-container">
              <button class="scrl scrl-left" data-scroll="left">
                <svg>
                  <use href="../styles/icons.svg#icon-leftScroll"></use>
                </svg>
              </button>

              <div class="guides">
                <a href="#/guide-profile?g=g1"><ag-guide-card guide-id="g1"></ag-guide-card></a>
                <a href="#/guide-profile?g=g2"><ag-guide-card guide-id="g2"></ag-guide-card></a>
                <a href="#/guide-profile?g=g3"><ag-guide-card guide-id="g3"></ag-guide-card></a>
                <a href="#/guide-profile?g=g2"><ag-guide-card guide-id="g2"></ag-guide-card></a>
                <a href="#/guide-profile?g=g1"><ag-guide-card guide-id="g1"></ag-guide-card></a>
                <a href="#/guide-profile?g=g3"><ag-guide-card guide-id="g3"></ag-guide-card></a>
              </div>

              <button class="scrl scrl-right" data-scroll="right">
                <svg>
                  <use href="../styles/icons.svg#icon-rightScroll"></use>
                </svg>
              </button>
            </div>

            <a href="#/guides" class="more-guides">
              <p>Бүгдийг харах</p>
              <svg class="more-icon">
                <use href="../styles/icons.svg#icon-arrow"></use>
              </svg>
            </a>
          </section>

          <!-- Сэтгэгдэл -->
          <section class="review-section">
            <h3>Сэтгэгдэл</h3>
            <ag-spot-review-list spot-id="${spot.id}"></ag-spot-review-list>
          </section>
        </div>
      </section>
    `;
  }

  attachEventListeners() {
    // Хөтөчийн scroll товчны listener
    this.onclick = (e) => {
      // Хөтөчийн scroll товч (зүүн/баруун)
      const scrollBtn = e.target.closest(".scrl");
      if (scrollBtn) {
        e.preventDefault();
        const guidesContainer = this.querySelector(".guides");
        if (!guidesContainer) return;

        const direction = scrollBtn.dataset.scroll === "left" ? -1 : 1;
        const amount = 300; // px

        guidesContainer.scrollBy({
          left: direction * amount,
          behavior: "smooth",
        });
      }
    };
  }
}

customElements.define("page-spot-info", PageSpotInfo);
