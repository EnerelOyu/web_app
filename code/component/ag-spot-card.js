class AgSpotCard extends HTMLElement {
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
    const href = this.getAttribute("href") || "#";
    const img = this.getAttribute("zrg") || "NULL";
    const area = this.getAttribute("bus") || "NULL";
    const rating = parseFloat(this.getAttribute("unelgee")) || "0.0";
    const title = this.getAttribute("ner") || "NULL";
    const cates = (this.getAttribute("cate") || "").split(",").map(t => t.trim()).filter(Boolean);
    const acts = (this.getAttribute("activity")||"").split(",").map(t => t.trim()).filter(Boolean);
    const price = this.getAttribute("une") || "";

    const starsHtml = this.createStars(rating);
    const catesHtml = cates.map(t => `<li>${t}</li>`).join("");
    const actsHtml = acts.map(t => `<li>${t}</li>`).join("");


    this.innerHTML = `
            <article class="spot-card">
                <figure class="spot-img">
                    <a href="${href}">
                    <img src="${img}" alt="${title}">
                    </a>
                    <button>
                        <svg>
                            <use href="../styles/icons.svg#icon-add"></use>
                        </svg>
                    </button>
                    <button>
                        <svg>
                            <use href="../styles/icons.svg#icon-share"></use>
                        </svg>
                    </button>
                </figure>
                <div class="spot-info">
                    <div class="short-info">
                        <p class="area">${area}</p>
                        <div class="rating">
                            <div class="readOnly-rating-stars">
                                ${starsHtml}
                            </div>
                            <p class="rating-num">${rating.toFixed(1)}</p>
                        </div>
                    </div>
                    <div class="line"></div>
                    <a href="${href}">
                    <h3>${title}</h3>
                    </a>
                    <ul class="tags">
                        ${catesHtml}${actsHtml}
                    </ul>
                    <div class="price">
                        <p>Тасалбарын эхлэх үнэ:</p>
                        <p>${price}</p>
                    </div>
                </div>
            </article>
    `;

  }

}

window.customElements.define('ag-spot-card', AgSpotCard);