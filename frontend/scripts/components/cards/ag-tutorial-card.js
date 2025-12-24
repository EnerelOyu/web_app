class AgTutorialCard extends HTMLElement {
  static get observedAttributes() {
    // Одоо хэрэглэж байгаа attribute нэртэйгээ тааруулна
    return ["zrg", "bogin", "urt"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    // attribute өөрчлөгдвөл дахин render хийнэ
    this.render();
  }

  render() {
    const img = this.getAttribute("zrg") || "";
    const shortText = this.getAttribute("bogin") || "";
    const longText = this.getAttribute("urt") || "";

    this.shadowRoot.innerHTML = `
      <style>
        @import url('./styles/global.css');
        @import url('/styles/fonts.css');

        :host {
          display: block;
        }

        .tutorial-card {
          display: flex;
          flex-direction: column;
          gap: var(--gap-size-s);
          padding: var(--p-md);
          border-radius: var(--br-m);
        }

        .tutorial-card img {
          width: 100%;
          border-radius: var(--br-m);
          transition: all 0.3s ease;
          display: block;
        }

        .tutorial-card:hover img {
          transform: scale(1.03);
        }

        .tutorial-card h4 {
          color: var(--text-color-2);
          margin: 0.25rem 0;
          font-family: 'Rubik';
        }

        .tutorial-card:hover h4 {
          color: var(--accent);
        }

        .tutorial-card p {
          color: var(--text-color-3);
          font-family: 'NunitoSans';
          margin: 0;
        }
      </style>

      <article class="tutorial-card">
        <img src="${img}" alt="${shortText || "tutorial image"}">
        <h4>${shortText}</h4>
        <p>${longText}</p>
      </article>
    `;
  }
}

customElements.define("ag-tutorial-card", AgTutorialCard);
