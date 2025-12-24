class guideInfo  extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const rating = parseFloat(this.getAttribute("unelgee"));
        this.innerHTML=`
            <div class="main-info">
                <div class="txt-info">
                    <h1>Хөтчийн мэдээлэл</h1>
                    <div class="rating">
                        <div class="readOnly-rating-stars">
                            ${starsHtml}
                        </div>
                        <p class="rating-num">${rating.toFixed(1)}</p>
                    </div>
                    <h2>Доржийн Намжирмаа</h2>
                    <p><span>Төрсөн огноо:</span> 2002.10.03</p>
                    <p><span>Холбогдох дугаар:</span> 90990990</p>
                </div>
                <div class="icon">
                    <svg>
                        <use href="./styles/icons.svg#icon-fb2"></use>
                    </svg>
                    <svg>
                        <use href="./styles/icons.svg#icon-share"></use>
                    </svg>
                </div>
                <img src="../assets/images/zurag.jpg" alt="profile">
            </div>
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
              <use href="./styles/icons.svg#icon-star-filled"></use>
          </svg>
      `;
    }

    if(hasHalf){
      html += `
          <svg class="star">
              <use href="./styles/icons.svg#icon-star-half"></use>
          </svg>
      `;
    }

    for(let i = 0; i < emptyStars; i++){
      html += `
          <svg class="star">
              <use href="./styles/icons.svg#icon-star-unfilled"></use>
          </svg>
      `;
    }

    return html;
     }
}
window.customElements.define('guide-info', guideInfo);