class AgReview extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        
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

  render(){
    const br = this.getAttribute("bogin")||"null";
    const lr = this.getAttribute("urt")||"null";
    const rating = parseFloat(this.getAttribute("unelgee")) || "0.0";
    const starsHtml = this.createStars(rating);

    this.innerHTML=`
    <article class="review-card">
        <p class="brief-review">${br}</p>
        <p class="comment">${lr}</p>
        <div class="rating">
            <div class="readOnly-rating-stars">
                ${starsHtml}
            </div>
            <p class="rating-num">${rating.toFixed(1)}</p>
        </div>
    </article>
    `;
  }

    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldVal, newVal) {
    }

    adoptedCallback() {
    }

}

window.customElements.define('ag-review', AgReview);