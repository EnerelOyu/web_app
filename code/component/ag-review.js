class AgReview extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const br = this.getAttribute("bogin")||"null";
        const lr = this.getAttribute("urt")||"null";
        this.innerHTML=`
        <article class="review-card">
            <p class="brief-review">${br}</p>
            <p class="comment">${lr}</p>
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
        </article>
        `
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldVal, newVal) {
    }

    adoptedCallback() {
    }

}

window.customElements.define('ag-review', AgReview);