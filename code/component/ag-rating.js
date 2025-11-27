class StarRating extends HTMLElement {
  connectedCallback() {
    const rating = parseFloat(this.getAttribute("value")) || 0;
    this.innerHTML = this.createStars(rating);
  }

  createStars(rating){
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    let html = "";

    for(let i = 0; i < fullStars; i++){
      html += `<svg class="star"><use href="../styles/icons.svg#icon-star-filled"></use></svg>`;
    }

    if(hasHalf){
      html += `<svg class="star"><use href="../styles/icons.svg#icon-star-half"></use></svg>`;
    }

    for(let i = 0; i < emptyStars; i++){
      html += `<svg class="star"><use href="../styles/icons.svg#icon-star-unfilled"></use></svg>`;
    }

    return html;
  }
}

customElements.define("star-rating", StarRating);
