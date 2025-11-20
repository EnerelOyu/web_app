class AgGuideCard extends HTMLElement {
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
    const name = this.getAttribute("ner") || "unKnown";
        const experience = this.getAttribute("turshilag") || "0";
        const language = (this.getAttribute("hel") || "").split(",").map( t => t.trim()).filter(Boolean);
        const phone = this.getAttribute("utas") || "unKnown";
        const rating = parseFloat(this.getAttribute("unelgee")) || "0.0";
        const starsHtml = this.createStars(rating);

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
                                ${starsHtml}
                            </div>
                            <p class="rating-num">${rating.toFixed(1)}</p>
                        </div>
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