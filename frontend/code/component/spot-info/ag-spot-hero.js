class AgSpotHero extends HTMLElement {
  static get observedAttributes() {
    // Спотын үндсэн мэдээллийг аттрибутаар өгнө
    return ["title", "rating", "cate", "status", "time", "img1", "img2", "img3"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
      this.attachEventListeners();
    }
  }

  render() {
    const title = this.getAttribute("title") || "";
    const rating = this.getAttribute("rating") || "0";

    const cates = (this.getAttribute("cate") || "")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const status = this.getAttribute("status") || "";
    const time = this.getAttribute("time") || "";

    const img1 = this.getAttribute("img1") || "";
    const img2 = this.getAttribute("img2") || "";
    const img3 = this.getAttribute("img3") || "";

    const cateHtml = cates.map((c) => `<li>${c}</li>`).join("");

    this.shadowRoot.innerHTML = `
      <style>
        @import url('../../../styles/fonts.css');

        :host {
          display: block;
        }

        /* =====================================================
           MAIN INFO - Үндсэн мэдээлэл контейнер
           ===================================================== */

        .main-info {
          display: flex;
          flex-direction: column;
          gap: var(--gap-size-s);
        }

        /* =====================================================
           HEADER - Гарчиг болон товчлууруud
           ===================================================== */

        .spot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--gap-size-m);
          margin-bottom: var(--gap-size-xs);
        }

        .spot-header h1 {
          font-family: 'Rubik';
          color: var(--text-color-1);
          font-size: var(--fs-xl);
          text-transform: uppercase;
          margin: 0;
          line-height: 1.2;
        }

        /* =====================================================
           ACTION BUTTONS - Хуваалцах, Нэмэх товчлууруud
           ===================================================== */

        .actions {
          display: flex;
          gap: var(--gap-size-xs);
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .action-btn {
          background-color: var(--primary-5);
          padding: var(--p-xs);
          cursor: pointer;
          color: var(--primary);
          display: inline-flex;
          align-items: center;
          gap: var(--gap-size-xs);
          border: none;
          border-radius: var(--br-s);
          font-family: 'NunitoSans';
          font-size: var(--fs-xs);
          text-transform: uppercase;
          transition: all 0.3s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .action-btn svg {
          width: var(--svg-s);
          height: var(--svg-s);
          fill: currentColor;
          transition: fill 0.3s ease;
        }

        .action-btn:hover {
          background-color: var(--primary);
          color: var(--primary-5);
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
        }

        .action-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        }

        .action-btn:hover svg {
          fill: var(--primary-5);
        }

        /* =====================================================
           RATING - Үнэлгээний компонент
           ===================================================== */

        ag-rating {
          margin: var(--gap-size-xs) 0;
        }

        /* =====================================================
           CATEGORIES & SCHEDULE ROW - Ангилал ба цагийн хуваарь
           ===================================================== */

        .category-schedule-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--gap-size-m);
          margin: 0;
          flex-wrap: wrap;
        }

        /* =====================================================
           CATEGORIES - Ангилал тагууд
           ===================================================== */

        .spot-category {
          display: flex;
          flex-wrap: wrap;
          gap: var(--gap-size-xs);
          padding: 0;
          margin: 0;
        }

        .spot-category li {
          list-style: none;
          border-radius: var(--br-s);
          padding: var(--p-xs);
          color: var(--accent-2);
          background-color: var(--accent-9);
          font-family: 'NunitoSans';
          font-size: var(--fs-sm);
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .spot-category li:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* =====================================================
           SCHEDULE - Цагийн хуваарь болон төлөв
           ===================================================== */

        .spot-schedue {
          display: flex;
          align-items: center;
          gap: var(--gap-size-xs);
          font-size: var(--fs-xs);
          font-family: 'NunitoSans';
          margin: 0;
          flex-shrink: 0;
        }

        .spot-schedue .status {
          background-color: var(--accent-2);
          color: var(--accent-9);
          padding: var(--p-xs);
          border-radius: var(--br-s);
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .spot-schedue .status:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .spot-schedue .time-zone {
          color: var(--accent-2);
        }

        /* =====================================================
           IMAGES - Зургийн grid бүтэц
           ===================================================== */

        .spot-imgs {
          display: grid;
          grid-template-columns: 2fr 1fr;
          grid-template-rows: repeat(2, 1fr);
          gap: var(--gap-size-xs);
        }

        .spot-imgs img {
          border-radius: var(--br-m);
          object-fit: cover;
          width: 100%;
          height: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .spot-imgs img:hover {
          transform: scale(1.02);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          cursor: pointer;
        }

        .big-img {
          grid-row: 1 / 3;
          min-height: 300px;
        }

        .small-img {
          min-height: 140px;
        }

        /* =====================================================
           RESPONSIVE DESIGN - Хариуцлагатай дизайн
           ===================================================== */

        /* Tablet - 768px ба түүнээс бага */
        @media (max-width: 768px) {
          .main-info {
            gap: var(--gap-size-xs);
          }

          .spot-header {
            gap: var(--gap-size-s);
          }

          .spot-header h1 {
            font-size: var(--fs-lg);
          }

          .spot-category li {
            font-size: var(--fs-xs);
          }

          .big-img {
            min-height: 250px;
          }

          .small-img {
            min-height: 120px;
          }
        }

        /* Mobile - 600px ба түүнээс бага */
        @media (max-width: 600px) {
          .main-info {
            gap: var(--gap-size-xs);
          }

          .spot-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--gap-size-xs);
            margin-bottom: var(--gap-size-xs);
          }

          .spot-header h1 {
            font-size: var(--fs-md);
          }

          .actions {
            width: 100%;
            justify-content: flex-start;
          }

          .action-btn {
            font-size: var(--fs-2xs);
            padding: calc(var(--p-xs) * 0.8);
          }

          .category-schedule-row {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--gap-size-xs);
            margin: var(--gap-size-2xs) 0 var(--gap-size-xs) 0;
          }

          .spot-category li {
            padding: calc(var(--p-xs) * 0.8);
          }

          .spot-imgs {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            gap: var(--gap-size-2xs);
            margin-top: var(--gap-size-xs);
          }

          .big-img {
            grid-row: auto;
            min-height: 200px;
          }

          .small-img {
            min-height: 150px;
          }
        }

        /* Small mobile - 400px ба түүнээс бага */
        @media (max-width: 400px) {
          .spot-header h1 {
            font-size: var(--fs-base);
          }

          .action-btn span {
            display: none;
          }

          .action-btn {
            padding: var(--p-xs);
          }

          .big-img {
            min-height: 180px;
          }

          .small-img {
            min-height: 120px;
          }
        }
      </style>

      <section class="main-info">
        <div class="spot-header">
          <h1>${title}</h1>
          <div class="actions">
            <button class="action-btn">
              <span>Хуваалцах</span>
              <svg>
                <use href="../styles/icons.svg#icon-share"></use>
              </svg>
            </button>
            <button class="action-btn">
              <span>Нэмэх</span>
              <svg>
                <use href="../styles/icons.svg#icon-add"></use>
              </svg>
            </button>
          </div>
        </div>

        <ag-rating value="${rating}" color="var(--primary)"></ag-rating>

        <div class="category-schedule-row">
          <ul class="spot-category">
            ${cateHtml}
          </ul>

          <div class="spot-schedue">
            <p class="status">${status}</p>
            <p class="time-zone">${time}</p>
          </div>
        </div>

        <div class="spot-imgs">
          <img class="big-img" src="${img1}" alt="main-img">
          <img class="small-img" src="${img2}" alt="img-2">
          <img class="small-img" src="${img3}" alt="img-3">
        </div>
      </section>
    `;
  }

  attachEventListeners() {
    const shadowRoot = this.shadowRoot;
    const buttons = shadowRoot.querySelectorAll('.action-btn');

    buttons.forEach(button => {
      const buttonText = button.querySelector('span')?.textContent;

      // "Нэмэх" товч
      if (buttonText === 'Нэмэх') {
        button.onclick = (e) => {
          e.preventDefault();
          this.handleAddToPlan(button);
        };
      }

      // "Хуваалцах" товч
      if (buttonText === 'Хуваалцах') {
        button.onclick = (e) => {
          e.preventDefault();
          this.handleShare();
        };
      }
    });
  }

  handleAddToPlan(button) {
    const spotId = this.getAttribute('data-spot-id');

    if (!spotId) {
      console.error('Spot ID олдсонгүй');
      return;
    }

    // Add to plan
    const success = window.appState.addToPlan(spotId);

    if (success) {
      // Visual feedback
      const originalHTML = button.innerHTML;
      const originalBg = button.style.backgroundColor;

      button.innerHTML = '<span>Нэмсэн!</span>';
      button.style.backgroundColor = 'var(--accent-2)';
      button.style.color = 'var(--accent-9)';

      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.backgroundColor = originalBg;
        button.style.color = '';
      }, 1500);

      // Navigate to plan page
      setTimeout(() => {
        window.location.hash = '#/plan';
      }, 600);
    }
  }

  handleShare() {
    const title = this.getAttribute('title') || 'Аялалын газар';
    const url = window.location.href;

    // Web Share API support check
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `${title} - Ayalgo аяллын апп`,
        url: url
      }).catch(err => {
        console.log('Хуваалцах үйлдэл цуцлагдлаа:', err);
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        alert('Холбоос хуулагдлаа!');
      }).catch(err => {
        console.error('Хуулахад алдаа гарлаа:', err);
        alert('Хуулахад алдаа гарлаа');
      });
    }
  }
}

customElements.define("ag-spot-hero", AgSpotHero);
