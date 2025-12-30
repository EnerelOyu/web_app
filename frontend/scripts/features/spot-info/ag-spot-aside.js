class AgSpotAside extends HTMLElement {
  static get observedAttributes() {
    
    return ["map-src", "region", "location", "age", "price", "schedule"];
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
    const mapSrc = this.getAttribute("map-src") || "../assets/images/Mongolia_blank.svg";
    const region = this.getAttribute("region") || "";
    const location = this.getAttribute("location") || "";
    const age = this.getAttribute("age") || "";
    const price = this.getAttribute("price") || "";
    
    const scheduleAttr = this.getAttribute("schedule") || "";
    const scheduleItems = scheduleAttr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // scheduleItems-ийг html жагсаалт болгон хөрвүүлнэ
    const scheduleHtml = scheduleItems
    .map((item) => {
        return `
        <li>
            <span class="value">${item}</span>
        </li>
        `;
    })
    .join("");


    this.shadowRoot.innerHTML = `
      <style>
        @import url('./styles/global.css');
        @import url('/styles/fonts.css');

        :host {
          display: block;
          height: 100%;
        }

        .spot-aside {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--p-sm);
          gap: var(--m-md);
          font-family: 'NunitoSans';
          font-size: var(--fs-sm);
          border-radius: var(--br-m);
          background: var(--bg-color);
          border: 2px solid var(--text-color-8);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          height: 100%;
          box-sizing: border-box;
        }

        .spot-aside img {
          width: 100%;
          align-self: center;
        }

        .info-list {
          margin: 0;
          padding: 0;
          display: grid;
          gap: var(--gap-size-s);
        }

        .info-list li {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: var(--gap-size-m);
        }

        .info-list .label {
          white-space: nowrap;
          color: var(--text-color-2);
          text-transform: uppercase;
          font-size: var(--fs-base);
        }

        .info-list .value {
          color: var(--accent-1);
        }

        .schedule {
          display: flex;
          flex-direction: column;
          gap: var(--gap-size-xs);
          padding: 0;
          margin: 0;
        }

        .schedule li {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: var(--gap-size-s);
          white-space: nowrap;
          list-style: none;
        }

        @media (max-width: 960px) {
          .spot-aside {
            width: 100%;
          }
        }

        @media (max-width: 600px) {
          .info-list li {
            grid-template-columns: 1fr;
          }

          .schedule li {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <aside class="spot-aside">
        <img src="${mapSrc}" alt="Map">
        <ul class="info-list">
          <li>
            <span class="label">Бүс нутаг:</span>
            <span class="value">${region}</span>
          </li>
          <li>
            <span class="label">Байршил:</span>
            <span class="value">${location}</span>
          </li>
          <li>
            <span class="label">Насны ангилал:</span>
            <span class="value">${age}</span>
          </li>
          <li>
            <span class="label">Эхлэх үнэ:</span>
            <span class="value">${price}</span>
          </li>
          <li>
            <span class="label">Цагийн хуваарь:</span>
            <span class="value">
              <ul class="schedule">
                ${scheduleHtml}
              </ul>
            </span>
          </li>
        </ul>
      </aside>
    `;
  }
}

customElements.define("ag-spot-aside", AgSpotAside);
