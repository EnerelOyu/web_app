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

    // SPOTS.CSS ажиллах боломжтой Light DOM HTML
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

    // ag-filter доторх checkbox өөрчлөгдөх болгонд
    this.addEventListener("change", () => this.update());
  }

  update() {
    const checked = [...this.querySelectorAll("input:checked")].map(
      (cb) => cb.value
    );

    this.dispatchEvent(
      new CustomEvent("filter-changed", {
        detail: {
          type: this.getAttribute("ner"), // "Категори", "Бүс нутаг" гэх мэт
          values: checked,                // ["Соёл", "Байгаль"] гэх мэт
        },
        bubbles: true,
      })
    );
  }
}

customElements.define("ag-filter", AgFilter);
