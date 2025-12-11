class suggestedPoint  extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const img = this.getAttribute("zrg") || "NULL";
        const area = this.getAttribute("bus") || "NULL";
        const rating = parseFloat(this.getAttribute("unelgee")) || "0.0";
        const title = this.getAttribute("ner") || "NULL";
        const starsHtml = this.createStars(rating);

        this.innerHTML=`<article style="background-image: url(${img});" class="TP">
                    <div class="tp_ic">
                        <div class="rating">
                            <div class="readOnly-rating-stars">
                                ${starsHtml}
                            </div>
                            <p class="rating-num">${rating.toFixed(1)}</p>
                        </div>
                        <button>
                            <svg>
                                <use href="../styles/icons.svg#icon-add"></use>
                            </svg>
                        </button>
                    </div>
                    <div class="tp-info">
                        <h3>${title}</h3>
                        <p>${area}</p>
                    </div>
            </article>
        `;
    }

    createStars(rating){
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    let html="";

    for(let i = 0; i < fullStars; i++){
      html += `
          <svg class="star">
              <use href="../styles/icons.svg#icon-star-filled"></use>
          </svg>
      `;
    }

    if(hasHalf){
      html += `
          <svg class="star">
              <use href="../styles/icons.svg#icon-star-half"></use>
          </svg>
      `;
    }

    for(let i = 0; i < emptyStars; i++){
      html += `
          <svg class="star">
              <use href="../styles/icons.svg#icon-star-unfilled"></use>
          </svg>
      `;
    }

    return html;

  }
}
window.customElements.define('suggested-point', suggestedPoint);