class AgSpot extends HTMLElement {
  static get observedAttributes() {
    return ["zrg", "ner", "bus"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const img = this.getAttribute("zrg") || "../assets/images/spot_img_eg.jpg";
    const name = this.getAttribute("ner") || "Unknown";
    const area = this.getAttribute("bus") || "Unknown";

    this.shadowRoot.innerHTML = `
      <style>
        @import url('/styles/fonts.css');

        :host {
          display: block;
          width: 100%;
        }

        .spot-card {
          display: flex;
          flex-direction: column;
          gap: var(--gap-size-xs);
          border-radius: var(--br-s);
          cursor: pointer;
        }

        .spot-img {
          position: relative;
          margin: 0;
          overflow: hidden;
          border-radius: var(--br-s);
          width: 100%;
        }

        .spot-img img {
          display: block;
          width: 100%;
          object-fit: cover;
          aspect-ratio: 3 / 4;
          border-radius: var(--br-s);
          transition: all 0.4s ease;
        }

        .spot-img button {
          position: absolute;
          top: var(--p-sm);
          right: var(--p-sm);
          border: none;
          border-radius: var(--br-s);
          width: var(--svg-m);
          height: var(--svg-m);
          display: inline-flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 10;
          backdrop-filter: blur(10px);
          background-color: var(--primary-5);
        }

        .spot-card:hover .spot-img button {
          opacity: 0.8;
          transform: scale(1.1);
        }

        .spot-img button:hover {
          background-color: var(--primary);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .spot-img button:hover svg {
          color: var(--primary-5);
        }

        .spot-img button:active {
          transform: scale(0.95);
        }

        .spot-img svg {
          color: var(--primary);
          width: 1.5rem;
          height: 1.5rem;
          transition: all 0.2s ease;
        }

        .line {
          background-color: var(--text-color-5);
          height: 1px;
          margin: 6px 0 4px;
        }

        .spot-area {
          font-size: var(--fs-xs);
          text-transform: uppercase;
          color: var(--text-color-3);
          font-family: 'NunitoSans';
          margin: 0;
        }

        .spot-name {
          font-size: var(--fs-base);
          color: var(--text-color-2);
          text-transform: uppercase;
          font-family: 'Rubik';
          margin: 0;
        }

        .spot-detail {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          gap: var(--gap-size-s);
          color: var(--text-color-2);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .spot-detail p {
          font-size: var(--fs-xs);
          text-transform: uppercase;
          font-family: 'NunitoSans';
          margin: 0;
        }

        .more-icon {
          width: var(--svg-s);
          height: var(--svg-s);
          color: var(--text-color-2);
          transition: transform 0.2s ease;
        }

        .spot-detail:hover .more-icon {
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .spot-card:hover .spot-img button {
            opacity: 1;
            transform: none;
          }
        }
      </style>

      <article class="spot-card">
        <figure class="spot-img">
          <img src="${img}" alt="${name}">
          <button type="button" aria-label="Маршрутдаа нэмэх">
            <svg aria-hidden="true" focusable="false">
              <use href="./styles/icons.svg#icon-add"></use>
            </svg>
          </button>
        </figure>
        <p class="spot-area">${area}</p>
        <h4 class="spot-name">${name}</h4>
        <div class="line"></div>
        <div class="spot-detail">
          <p>ДЭЛЭГРЭНГҮЙ</p>
          <svg class="more-icon" aria-hidden="true" focusable="false">
            <use href="./styles/icons.svg#icon-arrow"></use>
          </svg>
        </div>
      </article>
    `;
  }
}

customElements.define("ag-spot", AgSpot);
