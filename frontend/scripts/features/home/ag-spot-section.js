class AgSpotSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["title", "link"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute("title") || "Аяллын цэгүүд";
    const link = this.getAttribute("link") || "#";

    this.shadowRoot.innerHTML = `
      <style>
        @import url('/styles/fonts.css');

        :host {
          display: block;
          width: 100%;
        }

        .spots {
          width: 100%;
          max-width: 95vw;    
          margin: 0 auto; 
          display: flex;
          flex-direction: column;
          gap: var(--gap-size-l);
        }

        .spot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .spot-header h3 {
          padding: var(--p-lg) 0;
          color: var(--text-color-1);
          font-size: var(--fs-xl);
          text-align: start;
          margin: 0 ;
          text-transform: uppercase;
          font-family: 'Rubik';
        }

        .spots-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--gap-size-xl);
          margin: var(--m-md) var(--m-xl);
        }

        .more-spots {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          gap: var(--gap-size-s);
          color: var(--text-color-2);
          text-decoration: none;
          margin-right: var(--m-xl);
          padding: var(--p-sm) var(--p-md);
          font-family: 'NunitoSans';
        }

        .more-spots p {
          font-size: var(--fs-xs);
          text-transform: uppercase;
          margin: 0;
        }

        .more-icon {
          width: var(--svg-s);
          height: var(--svg-s);
          color: var(--text-color-2);
          transition: transform 0.2s ease;
        }

        .more-spots:hover .more-icon {
          transform: translateX(4px);
        }

        /*  MOBILE (≤768px)  */
        @media (max-width: 768px) {
          .spot-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--gap-size-s);
            padding: 0 var(--p-xs);
            margin: 0;
          }

          .spot-header h3 {
            font-size: var(--fs-lg);
            margin: 0;
            text-align: center;
            width: 100%;
          }

          .spots-grid {
            grid-template-columns: repeat(2, 1fr);
            margin: 0;
          }

          .more-spots {
            margin-right: 0;
            margin-left: 0;
            justify-content: center;
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .spots-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <section class="spots">
        <div class="spot-header">
          <h3>${title}</h3>
          <a href="${link}" class="more-spots">
            <p>Бүгдийг харах</p>
            <svg class="more-icon" aria-hidden="true" focusable="false">
              <use href="./styles/icons.svg#icon-arrow"></use>
            </svg>
          </a>
        </div>
        <div class="spots-grid">
          <!-- ag-spot-ууд энд slot-оор орж ирнэ -->
          <slot></slot>
        </div>
      </section>
    `;
  }
}

customElements.define("ag-spot-section", AgSpotSection);
