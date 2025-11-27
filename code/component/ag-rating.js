class AgRating extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ["value", "color"];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const rating = parseFloat(this.getAttribute("value")) || 0;
    const color = this.getAttribute("color") || "var(--accent-1)";

    const wrapper = document.createElement("div");
    wrapper.classList.add("rating");

    const stars = document.createElement("div");
    stars.classList.add("stars");
    stars.innerHTML = this.createStars(rating);

    const num = document.createElement("span");
    num.classList.add("rating-num");
    num.textContent = rating.toFixed(1);

    wrapper.appendChild(stars);
    wrapper.appendChild(num);

    const style = document.createElement("style");
    style.textContent = `
      .rating {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .stars .star {
        width: 16px;
        height: 16px;
        color: ${color};
        fill: currentColor;
      }

      .rating-num {
        font-size: 14px;
        font-family: 'NunitoSans';
        color: ${color};
      }
    `;

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.append(style, wrapper);
  }

  createStars(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    let html = "";

    for (let i = 0; i < full; i++) {
      html += `<svg class="star"><use href="../styles/icons.svg#icon-star-filled"></use></svg>`;
    }

    if (half) {
      html += `<svg class="star"><use href="../styles/icons.svg#icon-star-half"></use></svg>`;
    }

    for (let i = 0; i < empty; i++) {
      html += `<svg class="star"><use href="../styles/icons.svg#icon-star-unfilled"></use></svg>`;
    }

    return html;
  }
}

customElements.define("ag-rating", AgRating);
