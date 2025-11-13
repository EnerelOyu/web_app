class CategoryFilter extends HTMLElement {
    constructor() {
        super();
        
    }

    connectedCallback() {
        const group = (this.getAttribute("ner") || "Тодорхойгүй").trim();
        const choices = [
            this.getAttribute("turul1"),
            this.getAttribute("turul2"),
            this.getAttribute("turul3"),
            this.getAttribute("turul4"),
            this.getAttribute("turul5"),
            this.getAttribute("turul6"),
        ].filter(Boolean);
        
        this.innerHTML=`
            <fieldset class="filters">
                <legend>${group}</legend>
                ${choices
                    .map(
                        (c, i)=>`
                        <label>
                        <input type="checkbox" name="${group}" value="${c}" data-group="${group}">
                        ${c}
                        </label>`
                    )
                    .join("")}
                    
                </fieldset>
                `;
                this.addEventListener("change", () => {
                    const inputs = this.querySelectorAll('input[type="checkbox"]');
                    const selected = [...inputs].filter(i => i.checked).map(i => i.value);
                    this.dispatchEvent(
                        new CustomEvent("filter-change",{
                            bubbles: true,
                            detail: {group, selected},
                        })
                    );
                });

                const inputs = this.querySelectorAll('input[type="checkbox"]');
                const selected = [...inputs].filter(i => i.checked).map(i => i.value);
                this.dispatchEvent(
                    new CustomEvent("filter-change",{
                        bubbles: true,
                        detail:{group, selected},
                    })
                );
            
    }
    disconnectedCallback() {
        
    }

    attributeChangedCallback(name, oldVal, newVal) {
        
    }

    adoptedCallback() {
        
    }

}

window.customElements.define('ag-filter', CategoryFilter);