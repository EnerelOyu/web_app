class CategoryFilter extends HTMLElement {
    constructor() {
        super();
        
    }
    connectedCallback() {
        const ner = this.getAttribute("ner") || "null";
        const choice1 = this.getAttribute("turul1") || "unknown";
        const choice2 = this.getAttribute("turul2") || "unknown";
        const choice3 = this.getAttribute("turul3") || "unknown";
        const choice4 = this.getAttribute("turul4") || "unknown";
        const choice5 = this.getAttribute("turul5") || "unknown";
        const choice6 = this.getAttribute("turul6") || "";
        this.innerHTML=`<fieldset class="filters">
                    <legend>${ner}</legend>
                    <label><input type="checkbox">${choice1}</label>
                    <label><input type="checkbox">${choice2}</label>
                    <label><input type="checkbox">${choice3}</label>
                    <label><input type="checkbox">${choice4}</label>
                    <label><input type="checkbox">${choice5}</label>
                    <label><input type="checkbox">${choice6}</label>
                </fieldset>`;
    }

    disconnectedCallback() {
        
    }

    attributeChangedCallback(name, oldVal, newVal) {
        
    }

    adoptedCallback() {
        
    }

}

window.customElements.define('category-filter', CategoryFilter);