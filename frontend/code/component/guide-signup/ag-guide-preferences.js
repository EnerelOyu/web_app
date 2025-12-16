class AgGuidePreferences extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.options = {
      regions: [
        { value: "default", label: "" },
        { value: "tuv", label: "Төв" },
        { value: "zuun", label: "Зүүн" },
        { value: "baruun", label: "Баруун" },
        { value: "hangai", label: "Хангай" },
        { value: "altai", label: "Алтай" },
        { value: "govi", label: "Говь" },
      ],
      categories: [
        { value: "default", label: "" },
        { value: "culture", label: "Соёл" },
        { value: "resort", label: "Амралт сувилал" },
        { value: "adventure", label: "Адал явдалт" },
        { value: "nature", label: "Байгаль" },
        { value: "montain", label: "Ууланд гарах" },
      ],
      languages: [
        { value: "default", label: "" },
        { value: "mongolian", label: "Монгол хэл" },
        { value: "english", label: "Англи хэл" },
        { value: "russian", label: "Орос хэл" },
        { value: "chinese", label: "Хятад хэл" },
        { value: "japanese", label: "Япон хэл" },
      ],
      experience: [
        { value: "default", label: "" },
        { value: "1", label: "1 жил ба түүнээс доош" },
        { value: "1-5", label: "1 - 5 жил" },
        { value: "5++", label: "5 -аас дээш жил" },
      ],
    };

    this.onChange = this.onChange.bind(this);
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.addEventListener("change", this.onChange);
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener("change", this.onChange);
  }

  getValue() {
    const $ = (id) => this.shadowRoot.getElementById(id);
    return {
      region: $("bus_nutag")?.value ?? "default",
      category: $("category")?.value ?? "default",
      language: $("language")?.value ?? "default",
      experience: $("experience")?.value ?? "default",
    };
  }

  onChange(e) {
    if (e.target?.tagName === "SELECT") {
      this.dispatchEvent(
        new CustomEvent("preferences-change", {
          detail: this.getValue(),
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  renderSelect(id, label, items) {
    return `
      <label for="${id}">${label}</label>
      <select id="${id}" name="${id}">
        ${items.map(o => `<option value="${o.value}">${o.label}</option>`).join("")}
      </select>
    `;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .right-side{
          display: flex;
          flex-direction: column;
          gap: var(--gap-size-m);
        }

        label{
          text-transform: uppercase;
          font-family: 'NunitoSans';
          font-size: var(--fs-sm);
          color: var(--text-color-2);
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        select{
          background-color: var(--primary-5);
          border-radius: var(--br-s);
          border: 1px solid var(--text-color-2);
          padding: var(--p-xs);
          font-family: 'NunitoSans';
          color: var(--text-color-3);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        select:hover{
          border-color: var(--primary);
        }

        select:focus{
          outline: none;
          border-color: var(--secondary);
          box-shadow: 0 0 0 2px rgba(var(--secondary-rgb, 76, 175, 80), 0.2);
        }
      </style>

      <div class="right-side">
        ${this.renderSelect("bus_nutag", "Хөтөч хийх бүс нутаг", this.options.regions)}
        ${this.renderSelect("category", "Хөтөч хийх категори", this.options.categories)}
        ${this.renderSelect("language", "Хөтөч хийх хэл", this.options.languages)}
        ${this.renderSelect("experience", "Хөтөч хийсэн туршлага (жилээр)", this.options.experience)}
      </div>
    `;
  }
}

customElements.define("ag-guide-preferences", AgGuidePreferences);
export default AgGuidePreferences;
