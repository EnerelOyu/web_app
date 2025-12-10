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
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
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

        /* ----- Header + actions (spot-info.css-ээс авсан) ----- */

        .spot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--gap-size-m);
          margin-bottom: var(--m-sm);
        }

        .spot-header h1 {
          font-family: 'Rubik';
          color: var(--text-color-1);
          font-size: var(--fs-xl);
          text-transform: uppercase;
        }

        /* Top action buttons */

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
          transition: background-color 200ms, color 200ms;
        }

        .action-btn svg {
          width: var(--svg-s);
          height: var(--svg-s);
          fill: currentColor;
        }

        .action-btn:hover {
          background-color: var(--primary);
          color: var(--primary-5);
        }

        .action-btn:hover svg {
          fill: var(--primary-5);
        }

        /* Spot categories & schedule */

        .spot-category {
          display: flex;
          flex-wrap: wrap;
          gap: var(--gap-size-xs);
          padding: 0;
          margin: var(--m-sm) 0;
        }

        .spot-category li {
          list-style: none;
          border-radius: var(--br-s);
          padding: var(--p-xs);
          color: var(--accent-2);
          background-color: var(--accent-9);
          font-family: 'NunitoSans';
          font-size: var(--fs-base);
        }

        .spot-schedue {
          display: flex;
          align-items: center;
          gap: var(--gap-size-xs);
          font-size: var(--fs-xs);
          font-family: 'NunitoSans';
          margin-bottom: var(--m-md);
        }

        .spot-schedue .status {
          background-color: var(--accent-2);
          color: var(--accent-9);
          padding: var(--p-xs);
          border-radius: var(--br-s);
        }

        .spot-schedue .time-zone {
          color: var(--accent-2);
        }

        /* ----------- Images ----------- */

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
        }

        .big-img {
          grid-row: 1 / 3; /* 2 мөр дамнаж том зураг */
        }

        /* Media query – зөвхөн hero-т хамаатай хэсгийг авсан */

        @media (max-width: 600px) {
          .spot-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .actions {
            width: 100%;
            justify-content: flex-start;
            flex-wrap: wrap;
          }

          .spot-imgs {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
          }

          .big-img {
            grid-row: auto;
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
            <button class="action-btn">
              <span>Хадгалах</span>
              <svg>
                <use href="../styles/icons.svg#icon-save"></use>
              </svg>
            </button>
          </div>
        </div>

        <ag-rating value="${rating}" color="var(--primary)"></ag-rating>

        <ul class="spot-category">
          ${cateHtml}
        </ul>

        <div class="spot-schedue">
          <p class="status">${status}</p>
          <p class="time-zone">${time}</p>
        </div>

        <div class="spot-imgs">
          <img class="big-img" src="${img1}" alt="main-img">
          <img class="small-img" src="${img2}" alt="img-2">
          <img class="small-img" src="${img3}" alt="img-3">
        </div>
      </section>
    `;
  }
}

customElements.define("ag-spot-hero", AgSpotHero);
