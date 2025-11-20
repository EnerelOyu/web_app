class AgGuideCard extends HTMLElement {
    constructor() {
        super();
    
    }

    connectedCallback() {
        const name = this.getAttribute("ner") || "unKnown";
        const experience = this.getAttribute("turshilag") || "0";
        const language = this.getAttribute("hel") || "unKnown";
        const phone = this.getAttribute("utas") || "unKnown";
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
                        <div class="rating">
                            <div class="readOnly-rating-stars">
                                <svg class="star">
                                    <use href="../styles/icons.svg#icon-star-filled"></use>
                                </svg>
                                <svg class="star">
                                    <use href="../styles/icons.svg#icon-star-filled"></use>
                                </svg>
                                <svg class="star">
                                    <use href="../styles/icons.svg#icon-star-filled"></use>
                                </svg>
                                <svg class="star">
                                    <use href="../styles/icons.svg#icon-star-filled"></use>
                                </svg>
                                <svg class="star">
                                    <use href="../styles/icons.svg#icon-star-filled"></use>
                                </svg>
                            </div>
                            <p class="rating-num">5.0</p>
                        </div>
                    </article>`

    }

    disconnectedCallback() {
    
    }

    attributeChangedCallback(name, oldVal, newVal) {
    
    }

    adoptedCallback() {
    
    }

}

window.customElements.define('ag-guide-card', AgGuideCard);