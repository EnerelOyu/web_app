// URL параметрээс spotId авч, тухайн газрын бүх мэдээлэл харуулна
class PageSpotInfo extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.css = `
      @import url('./styles/global.css');
      @import url('./styles/fonts.css');

      /* ANIMATIONS */
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

      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .page-spot-info {
        display: flex;
        flex-direction: column;
        gap: var(--m-xl);
        padding: var(--m-md);
      }

      .page-spot-info .spot-main {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--gap-size-m);
        align-items: stretch;
        animation: fadeIn 0.6s ease-out;
      }

      .page-spot-info .spot-main > :first-child {
        animation: fadeInLeft 0.8s ease-out;
      }

      .page-spot-info .spot-main > :last-child {
        animation: fadeInRight 0.8s ease-out;
      }

      /* SECTION TITLE */

      .page-spot-info h2 {
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
        animation: fadeIn 0.8s ease-out 0.3s backwards;
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

      .page-spot-info .guide-section {
        display: flex;
        flex-direction: column;
        gap: var(--m-md);
        animation: fadeIn 0.8s ease-out 0.5s backwards;
      }

      .page-spot-info .review-section {
        display: flex;
        flex-direction: column;
        gap: var(--m-md);
        animation: fadeIn 0.8s ease-out 0.7s backwards;
      }

      .page-spot-info .guide-scroll-container {
        position: relative;
        display: block;
        padding: var(--p-sm) 0;
      }

      .page-spot-info .guides,
      .page-spot-info .reviews {
        display: flex;
        gap: var(--gap-size-m);
        overflow-x: auto;
        scroll-behavior: smooth;
        margin: 0 var(--m-lg);
        padding: var(--p-md) 0;
        align-items: stretch;
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
        flex-shrink: 0;
      }


      /* SCROLL BUTTONS*/

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

      /* REVIEW CARD */

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

      /* Хариуцлагатай загвар - төхөөрөмжийн хэмжээнд тохируулах */

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

        .page-spot-info .guides,
        .page-spot-info .reviews {
          padding: var(--p-sm) 0;
        }
      }

      @media (max-width: 480px) {
        .page-spot-info .intro p,
        .page-spot-info .guides,
        .page-spot-info .reviews {
          margin: 0 var(--m-xs);
        }
      }
    `;
  }

  //Toast мэдэгдлийн систем тохируулах
  setupToast() {
    if (!document.querySelector('ag-toast')) {
      const toast = document.createElement('ag-toast');
      document.body.appendChild(toast);
    }
    this.toast = document.querySelector('ag-toast');
  }

  // Element DOM дээр холбогдох үед дуудагдана
  connectedCallback() {
    // URL-аас gazrын ID-г авч, appState-д тохируулах
    this.loadSpotFromURL();

    // Хуудсыг анх зурж, event listener-үүдийг холбох
    this.render();
    this.setupToast();
    this.attachEventListeners();

    // appState-ийн өөрчлөлтийг сонсох - газрын өгөгдөл шинэчлэгдвэл дахин зурах
    window.addEventListener("appstatechange", (e) => {
      if (e.detail.key === "currentSpot") {
        this.render();
        this.attachEventListeners();
      } else if (e.detail.key === "spotData") {
        // spotData ачаалагдсан бол URL-аас дахин current spot тохируулах
        this.loadSpotFromURL();
        this.render();
        this.attachEventListeners();
      }
    });

    // Шинэ үнэлгээ нэмэгдэх үед газрын үнэлгээг шинэчлэх
    window.addEventListener("spot-review-added", async () => {
      // ag-spot-hero элементийг олж, үнэлгээг дахин тооцоолох
      const spotHero = this.shadowRoot.querySelector('#current-spot-hero');
      if (spotHero) {
        const spotId = spotHero.getAttribute('spot-id');
        if (spotId) {
          await spotHero.fetchAndCalculateRating(spotId);
          spotHero.render();
          spotHero.attachEventListeners();
        }
      }
    });
  }

  loadSpotFromURL() {
    // URL hash-аас параметр авах
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(hash.split('?')[1] || '');
    const spotId = urlParams.get('spotId');

    // spotId байвал appState-д одоогийн газар болгон тохируулах
    if (spotId) {
      window.appState.setCurrentSpot(spotId);
    }
  }

  render() {
    // appState-аас одоогийн газрын мэдээллийг авах, байхгүй бол default газар авах
    const spot =
      window.appState.currentSpot ||
      window.appState.getSpot("amarbayasgalant");

    // Газрын өгөгдөл хараахан ачаалагдаагүй бол "Ачаалж байна" мессеж харуулах
    if (!spot) {
      this.shadowRoot.innerHTML = `
        <style>${this.css}</style>
        <div style="display: flex; justify-content: center; align-items: center; min-height: 50vh;">
          <p style="font-family: 'NunitoSans'; font-size: var(--fs-lg); color: var(--text-color-3);">
            Өгөгдөл ачаалж байна...
          </p>
        </div>
      `;
      return;
    }

    // Тухайн газрын бүс нутагт хөтөч хийдэг хөтөчдийг шүүж авах
    const allGuides = window.appState.getAllGuides();
    const filteredGuides = allGuides.filter(guide => guide.area === spot.region);

    this.shadowRoot.innerHTML = `
      <style>${this.css}</style>
      <section class="page-spot-info">
        <!-- Газрын үндсэн мэдээлэл: зураг, нэр, үнэлгээ (зүүн), газрын зураг, хаяг (баруун) -->
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
            spot-id="${spot.id}"
            data-spot-id="${spot.id}"
          ></ag-spot-hero>
          <ag-spot-aside
            map-src="${spot.mapSrc || './assets/images/Mongolia_blank.svg'}"
            region="${spot.region}"
            location="${spot.location}"
            age="${spot.age}"
            price="${spot.price}"
            schedule="${spot.schedule}"
          ></ag-spot-aside>
        </div>

        <!-- Газрын дэлгэрэнгүй: танилцуулга, хөтөч, сэтгэгдэл -->
        <div class="spot-details">
          <!-- Танилцуулга хэсэг -->
          <section class="intro">
            <h2>Танилцуулга</h2>
            <p>${spot.description}</p>
          </section>

          <!-- Санал болгох хөтөч хэсэг - хэвтээ гүйлгэх боломжтой -->
          <section class="guide-section">
            <h2>Санал болгох хөтөч</h2>
            <div class="guide-scroll-container">
              <button class="scrl scrl-left" data-scroll="left" aria-label="Зүүн тийш гүйлгэх">
                <svg>
                  <use href="./styles/icons.svg#icon-leftScroll"></use>
                </svg>
              </button>

              <div class="guides">
                ${filteredGuides.slice(0, 10).map(guide => `<a href="#/guide-profile?g=${guide.id}"><ag-guide-card guide-id="${guide.id}"></ag-guide-card></a>`).join('')}
              </div>

              <button class="scrl scrl-right" data-scroll="right" aria-label="Баруун тийш гүйлгэх">
                <svg>
                  <use href="./styles/icons.svg#icon-rightScroll"></use>
                </svg>
              </button>
            </div>

            <a href="#/guides" class="more-guides">
              <p>Бүгдийг харах</p>
              <svg class="more-icon">
                <use href="./styles/icons.svg#icon-arrow"></use>
              </svg>
            </a>
          </section>

          <!-- Сэтгэгдэл хэсэг -->
          <section class="review-section">
            <ag-spot-review-list spot-id="${spot.id}"></ag-spot-review-list>
          </section>
        </div>
      </section>
    `;
  }

  attachEventListeners() {
    this.shadowRoot.addEventListener('click', (e) => {
      // Хөтөчийн scroll товч дарагдсан эсэхийг шалгах
      const scrollBtn = e.target.closest(".scrl");
      if (scrollBtn) {
        e.preventDefault();
        const guidesContainer = this.shadowRoot.querySelector(".guides");
        if (!guidesContainer) return;

        // Зүүн эсвэл баруун гүйх чиглэл тодорхойлох
        const direction = scrollBtn.dataset.scroll === "left" ? -1 : 1;
        const amount = 300; // Гүйх зай (pixel)
        guidesContainer.scrollBy({
          left: direction * amount,
          behavior: "smooth",
        });
      }
    });
  }
}

customElements.define("ag-page-spot-info", PageSpotInfo);
