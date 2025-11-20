class AgFilter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const group = this.getAttribute("ner") || "Ангилал";

    const choices = [
      this.getAttribute("turul1"),
      this.getAttribute("turul2"),
      this.getAttribute("turul3"),
      this.getAttribute("turul4"),
      this.getAttribute("turul5"),
      this.getAttribute("turul6"),
    ].filter(Boolean);

    this.innerHTML = `
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

    this.addEventListener("change", () => this.update());
  }

  update() {
    const checked = [...this.querySelectorAll("input:checked")].map(
      (cb) => cb.value
    );

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
