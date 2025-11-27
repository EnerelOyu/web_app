class AgSpotCard extends HTMLElement {
  constructor() {
    super();
        this.css=`
        .spot-card {
        display: flex;
        flex-direction: column;
        gap: var(--gap-size-xs);
        border-radius: var(--br-s);
        transition: background-color 200ms;
        padding:var(--p-xs);
    }


    .spot-card:hover{
        background-color: var(--accent-9);
    }

    .spot-img {
        position: relative;
        display: inline-block;
        overflow: hidden;
        border-radius: var(--br-s);
    }

    .spot-img img {
        display: block;
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        border-radius: var(--br-s);
    }

    .spot-img button {
        position: absolute;
        top: var(--p-sm);
        width: var(--svg-m);
        height: var(--svg-m);
        border: none;
        border-radius: var(--br-s);
        background-color: var(--primary-5);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        opacity: 0.7;
        transition: background-color 0.5s, opacity 0.5s;
    }

    .spot-img button:nth-of-type(1) {
        right: 10px;
    }

    .spot-img button:nth-of-type(2) {
        left: 10px;
    }

    .spot-img button:hover {
        background-color: var(--primary);
        border: 1px solid var(--primary);
        opacity: 1;
    }

    .spot-img button:hover svg {
        color: var(--primary-5);
        opacity: 1;
    }

    .spot-img svg {
        width: var(--svg-m);
        height: var(--svg-m);
        color: var(--primary);
        opacity: 0.8;
        transition: color 0.5s, opacity 0.5s;
    }

    .rating {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--gap-size-xs);
    }

    .readOnly-rating-stars {
        display: inline-flex;
    }

    .readOnly-rating-stars .star {
        width: var(--svg-s);
        height: var(--svg-s);
        display: block;
        color: var(--accent-1);
    }

    .rating .rating-num {
        font-family: 'NunitoSans';
        font-size: var(--fs-sm);
        color: var(--accent-1);
    }

    .spot-info {
        display: flex;
        flex-direction: column;
        gap: var(--gap-size-xs);
    }

    .short-info {
        display: flex;
        justify-content: space-between;
    }

    .line {
        height: 1px;
        margin: 6px 0 4px;
        background-color: var(--text-color-3);
    }

    .spot-info h3 {
        font-family: 'Rubik';
        font-size: var(--fs-base);
        color: var(--text-color-2);
        text-transform: uppercase;
        transition: font-size 200ms;
    }

    .spot-card:hover .spot-info h3 {
        font-size: var(--fs-hvr);
    }

    .spot-info p {
        font-size: var(--fs-sm);
        color: var(--text-color-3);
        text-transform: uppercase;
    }


    .tags {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: var(--gap-size-xs);
        margin: 0;
        padding: 0;
    }

    .tags li {
        list-style: none;
        font-family: 'NunitoSans';
        color: var(--accent-1);
        background-color: var(--accent-9);
        border-radius: var(--br-s);
        padding: var(--p-xs);
        font-size: var(--fs-sm);
    }


    .price {
        display: flex;
        justify-content: space-between;
    }
    
    `;

  }

  connectedCallback() {
    this.render();

    
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
           <style>${this.css}</style>
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
                        <ag-rating></ag-rating>
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