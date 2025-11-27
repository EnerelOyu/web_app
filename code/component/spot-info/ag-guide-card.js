class AgGuideCard extends HTMLElement {
    constructor() {
        super();
    
    }

    connectedCallback() {
        this.render();
        

    }

  render(){
    const name = this.getAttribute("ner") || "unKnown";
        const experience = this.getAttribute("turshilag") || "0";
        const language = (this.getAttribute("hel") || "").split(",").map( t => t.trim()).filter(Boolean);
        const phone = this.getAttribute("utas") || "unKnown";
        const rating = parseFloat(this.getAttribute("unelgee")) || "0.0";

        this.innerHTML = `<article class="guide-card">
                        <div class="guide-info">
                            <svg class="default-profile">
                                <use href="../styles/icons.svg#default-profile"></use>
                            </svg>
                            <ul>
                                <li><span class="label">Нэр:</span><span class="value">${name}</span></li>
                                <li><span class="label">Туршлага:</span><span class="value">${experience}</span></li>
                                <li><span class="label">Хөтлөх хэл:</span><span class="value">${language}</span></li>
                                <li><span class="label">Дугаар:</span><span class="value">${phone}</span></li>
                            </ul>
                        </div>
                        <ag-rating value="${rating}" color = "var(--accent-1)"></ag-rating>
                    </article>`;

  }

    disconnectedCallback() {
    
    }

    attributeChangedCallback(name, oldVal, newVal) {
    
    }

    adoptedCallback() {
    
    }

}

window.customElements.define('ag-guide-card', AgGuideCard);