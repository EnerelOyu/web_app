// ag-spot-card.js
class SpotCard extends HTMLElement {
  static get observedAttributes() {
    return ["title", "rating", "area", "price", "categories", "activities", "img"];
  }

  get titleText() { return this.getAttribute("title") || "Тодорхойгүй"; }
  get ratingNum() { return parseFloat(this.getAttribute("rating") || "0"); }
  get areaText()  { return this.getAttribute("area") || "Тодорхойгүй"; }
  get priceNum()  { return parseFloat(this.getAttribute("price") || "0"); }
  get imgSrc()    { return this.getAttribute("img") || "../files/14Landscape3.png"; }

  get categories() {
    return (this.getAttribute("categories") || "")
      .split(",").map(s => s.trim()).filter(Boolean);
  }
  get activities() {
    return (this.getAttribute("activities") || "")
      .split(",").map(s => s.trim()).filter(Boolean);
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  formatPrice(n) {
    return Number.isFinite(n) ? `${n.toLocaleString("mn-MN")} ₮` : "0 ₮";
  }

  buildStars(rating) {
    const full = Math.max(0, Math.min(5, Math.floor(rating)));
    const empty = 5 - full;
    const one = filled =>
      `<svg class="star"><use href="../styles/icons.svg#${filled ? "icon-star-filled" : "icon-star"}"></use></svg>`;
    return `${Array(full).fill(one(true)).join("")}${Array(empty).fill(one(false)).join("")}`;
  }

  render() {
    const title  = this.titleText;
    const rating = Number.isFinite(this.ratingNum) ? this.ratingNum : 0;
    const area   = this.areaText;
    const price  = this.formatPrice(this.priceNum);
    const cats   = this.categories;
    const acts   = this.activities;
    const img    = this.imgSrc;

    this.innerHTML = `
      <article class="spot-card">
        <div class="spot-img">
          <a target="_blank" href="aylaliin_tsegiin_medeelel.html">
            <img src="${img}" alt="${title}">
          </a>
        </div>

        <div class="spot-info">
          <h3>${title}</h3>

          <div class="rating">
            <div class="readOnly-rating-stars">${this.buildStars(rating)}</div>
            <p class="rating-num">${rating.toFixed(1)}</p>
          </div>

          <ul class="tags">
            ${cats.slice(0, 2).map(c => `<li>${c}</li>`).join("")}
            ${acts.slice(0, 1).map(a => `<li>${a}</li>`).join("")}
          </ul>

          <p>Бүс нутаг: ${area}</p>
          <p>Тасалбарын эхлэх үнэ: ${price}</p>

          <div class="action-btns">
            <button class="btn" data-action="add"><svg><use href="../styles/icons.svg#icon-add"></use></svg></button>
            <button class="btn" data-action="share"><svg><use href="../styles/icons.svg#icon-share"></use></svg></button>
          </div>
        </div>
      </article>
    `;

    this.querySelectorAll(".action-btns .btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("ag-spot-action", {
          bubbles: true, composed: true,
          detail: { action: btn.dataset.action, title }
        }));
      });
    });
  }
}

customElements.define("ag-spot-card", SpotCard);
