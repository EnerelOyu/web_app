class AgFilter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["ner", "turul1", "turul2", "turul3", "turul4", "turul5", "turul6"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    // атрибут өөрчлөгдвөл (жишээ нь динамикаар) дахин зурах
    if (this.isConnected) {
      this.render();
    }
  }

  render() {
    const group = this.getAttribute("ner") || "Ангилал";

    const choices = [
      this.getAttribute("turul1"),
      this.getAttribute("turul2"),
      this.getAttribute("turul3"),
      this.getAttribute("turul4"),
      this.getAttribute("turul5"),
      this.getAttribute("turul6"),
    ].filter(Boolean);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        fieldset.filters {
          display: flex;
          flex-direction: column;
          border: none;
          margin: 0;
          padding: 0;
        }

        legend {
          font-family: 'Rubik';
          font-size: var(--fs-base);
          color: var(--text-color-2);
          text-transform: uppercase;
          margin-bottom: var(--m-sm);
          font-weight: 400;
        }

        label {
          font-family: 'NunitoSans';
          font-size: var(--fs-base);
          color: var(--text-color-3);
          display: flex;
          align-items: center;
          gap: var(--gap-size-xs);
        }

        /* Checkbox */
        input[type="checkbox"] {
          cursor: pointer;
          accent-color: var(--primary);
          background-color: var(--primary-5);
          appearance: none;
          -webkit-appearance: none;
          width: var(--svg-s);
          height: var(--svg-s);
          border-radius: 50%;
          border: 1px solid var(--primary);
          transition: background-color 0.2s;
          flex-shrink: 0;
        }

        input[type="checkbox"]:checked {
          background-color: var(--primary);
        }

        input[type="checkbox"]:hover {
          background-color: var(--primary);
        }
      </style>

      <fieldset class="filters">
        <legend>${group}</legend>
        ${choices
          .map(
            (c) => `
          <label>
            <input type="checkbox" value="${c}">
            ${c}
          </label>
        `
          )
          .join("")}
      </fieldset>
    `;

    // change эвэнтийг shadow дотор нь сонсоно
    this.shadowRoot.addEventListener("change", () => this.update());
  }

  update() {
    const checked = [
      ...this.shadowRoot.querySelectorAll("input:checked"),
    ].map((cb) => cb.value);

    this.dispatchEvent(
      new CustomEvent("filter-changed", {
        detail: {
          type: this.getAttribute("ner"),
          values: checked,
        },
        bubbles: true,
      })
    );
  }
}

customElements.define("ag-filter", AgFilter);
