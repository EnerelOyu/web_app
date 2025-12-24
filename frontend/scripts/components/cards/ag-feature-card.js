class AgFeatureCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const icon = this.getAttribute("icon") || "";
    const text = this.getAttribute("text") || "";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--gap-size-m);
          text-align: center;
          transition: all 0.3s ease;
          cursor: default;
          padding: var(--p-md);
          border-radius: var(--br-m);
        }

        :host(:hover) {
          transform: translateY(-8px);
          background-color: var(--primary-5);
        }

        svg {
          width: var(--svg-l);
          height: var(--svg-l);
          color: var(--primary);
          padding: var(--p-xs);
          transition: all 0.3s ease;
        }

        :host(:hover) svg {
          color: var(--secondary);
          transform: scale(1.15) rotate(5deg);
        }

        p {
          color: var(--text-color-3);
          transition: color 0.2s ease;
          font-family: 'NunitoSans';
          font-size: var(--fs-base);
        }

        :host(:hover) p {
          color: var(--text-color-1);
          font-weight: 500;
        }
      </style>

      <svg aria-hidden="true" focusable="false">
        <use href="/styles/icons.svg#icon-${icon}"></use>
      </svg>
      <p>${text}</p>
    `;
  }
}

customElements.define("ag-feature-card", AgFeatureCard);
