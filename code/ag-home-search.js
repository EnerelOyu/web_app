class AgHomeSearch extends HTMLElement {
    constructor() {
        super();
        //implementation
    }

    connectedCallback() {
        const name = this.getAttribute("name")||"Unknown"
        const options = [
            this.getAttribute("op1"),
            this.getAttribute("op2"),
            this.getAttribute("op3"),
            this.getAttribute("op4"),
            this.getAttribute("op5"),
            this.getAttribute("op5"),
        ].filter(Boolean)
        this.innerHTML=`
        <form>
      <label for="areas">Бүс нутаг</label>
      <select name="areas" id="areas">
        <option value="tuv">Төв</option>
        <option value="hangai">Хангай</option>
        <option value="zuun">Зүүн</option>
        <option value="baruun">Баруун</option>
        <option value="altai">Алтай</option>
        <option value="govi">Говь</option>
      </select>
    </form>
        `
    }

    disconnectedCallback() {
        //implementation
    }

    attributeChangedCallback(name, oldVal, newVal) {
        //implementation
    }

    adoptedCallback() {
        //implementation
    }

}

window.customElements.define('ag-home-search', AgHomeSearch);