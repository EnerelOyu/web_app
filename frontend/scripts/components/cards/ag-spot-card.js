class AgSpotCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.realRating = null;

    this.css = `
      .spot-card {
        display: flex;
        flex-direction: column;
        gap: var(--gap-size-xs);
        border-radius: var(--br-m);
        transition: background-color 200ms;
        padding: 0 var(--p-xs);
        overflow: hidden;
        align-items: center;
      }

      .spot-card:hover {
        background-color: var(--accent-9);
      }

      .spot-img {
        display: block;
        position: relative;
        width: 100%;
        overflow: hidden;
        border-radius: var(--br-m);
      }

      .spot-img img {
        display: block;
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        border-radius: 0;
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

      .spot-info {
        display: flex;
        flex-direction: column;
        padding: 0;
        width: 100%;
      }

      .short-info {
        display: flex;
        justify-content: space-between;
      }

      .line {
        height: 1px;
        margin: 0 ;
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
        font-family: 'NunitoSans';
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

      a {
        text-decoration: none;
        color: inherit;
      }
    `;
  }

  static get observedAttributes() {
    return ["href", "zrg", "bus", "unelgee", "ner", "cate", "activity", "une", "data-spot-id"];
  }

  async connectedCallback() {
    const spotId = this.getAttribute('data-spot-id');
    if (spotId) {
      await this.fetchAndCalculateRating(spotId);
    }
    this.render();
    this.attachEventListeners();
  }

  async attributeChangedCallback(name, oldValue, newValue) {
    if (this.isConnected) {
      if (name === 'data-spot-id' && newValue && oldValue !== newValue) {
        await this.fetchAndCalculateRating(newValue);
      }
      this.render();
      this.attachEventListeners();
    }
  }

  async fetchSpotReviews(spotId) {
    try {
      const response = await fetch(`http://localhost:3000/api/spots/${spotId}/reviews`);
      if (!response.ok) {
        throw new Error('Failed to fetch spot reviews');
      }
      const data = await response.json();
      return data.reviews;
    } catch (error) {
      console.error('Error fetching spot reviews:', error);
      return [];
    }
  }

  calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / reviews.length;
    return Math.round(average * 10) / 10;
  }

  async fetchAndCalculateRating(spotId) {
    const reviews = await this.fetchSpotReviews(spotId);
    this.realRating = this.calculateAverageRating(reviews);
  }

  attachEventListeners() {
    // Get buttons from shadow DOM
    const addButton = this.shadowRoot.querySelector('.spot-img button:nth-of-type(1)');
    const shareButton = this.shadowRoot.querySelector('.spot-img button:nth-of-type(2)');
    const notifyPlanUpdate = (status, spotId) => {
      this.dispatchEvent(new CustomEvent('plan-add-result', {
        detail: { status, spotId },
        bubbles: true,
        composed: true
      }));
    };

    // "Нэмэх" товч - remove old listeners before adding new ones
    if (addButton) {
      // Clone button to remove all existing event listeners
      const newAddButton = addButton.cloneNode(true);
      addButton.parentNode.replaceChild(newAddButton, addButton);

      newAddButton.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const spotId = this.getAttribute('data-spot-id');
        if (spotId && window.appState) {
          const result = await window.appState.addToPlan(spotId);
          if (result === true) {
            // Visual feedback
            newAddButton.style.backgroundColor = 'var(--accent-2)';
            const originalSvg = newAddButton.innerHTML;
            newAddButton.innerHTML = '<svg><use href="/styles/icons.svg#icon-check"></use></svg>';

            setTimeout(() => {
              newAddButton.style.backgroundColor = '';
              newAddButton.innerHTML = originalSvg;
            }, 1000);
            notifyPlanUpdate('added', spotId);
          } else if (result === 'exists') {
            notifyPlanUpdate('exists', spotId);
          } else {
            notifyPlanUpdate('error', spotId);
          }
        }
      });
    }

    // "Хуваалцах" товч - remove old listeners before adding new ones
    if (shareButton) {
      // Clone button to remove all existing event listeners
      const newShareButton = shareButton.cloneNode(true);
      shareButton.parentNode.replaceChild(newShareButton, shareButton);

      newShareButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const title = this.getAttribute('ner') || 'Аялалын газар';
        const href = this.getAttribute('href') || '';
        const url = window.location.origin + window.location.pathname + href;

        // Web Share API support check
        if (navigator.share) {
          navigator.share({
            title: title,
            text: `${title} - Ayalgo аяллын апп`,
            url: url
          }).catch(err => {
            console.log('Хуваалцах үйлдэл цуцлагдлаа:', err);
          });
        } else {
          // Fallback: Copy to clipboard
          navigator.clipboard.writeText(url).then(() => {
            alert('Холбоос хуулагдлаа!');
          }).catch(err => {
            console.error('Хуулахад алдаа гарлаа:', err);
          });
        }
      });
    }
  }

  render() {
    const href = this.getAttribute("href") || "#";
    const img = this.getAttribute("zrg") || "";
    const area = this.getAttribute("bus") || "";
    // Use real rating if available, otherwise fall back to attribute
    const rating = this.realRating !== null ? this.realRating : (parseFloat(this.getAttribute("unelgee")) || 0);
    const title = this.getAttribute("ner") || "";
    const cates = (this.getAttribute("cate") || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const acts = (this.getAttribute("activity") || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const price = this.getAttribute("une") || "";

    const catesHtml = cates.map((t) => `<li>${t}</li>`).join("");
    const actsHtml = acts.map((t) => `<li>${t}</li>`).join("");

    this.shadowRoot.innerHTML = `
      <style>${this.css}</style>
      <article class="spot-card">
        <figure class="spot-img">
          <a href="${href}">
            <img src="${img}" alt="${title}">
          </a>
          <button type="button" aria-label="Төлөвлөгөөнд нэмэх">
            <svg>
              <use href="/styles/icons.svg#icon-add"></use>
            </svg>
          </button>
          <button type="button" aria-label="Хуваалцах">
            <svg>
              <use href="/styles/icons.svg#icon-share"></use>
            </svg>
          </button>
        </figure>
        <div class="spot-info">
          <div class="short-info">
            <p class="area">${area}</p>
            <ag-rating value="${rating}" color="var(--accent-1)"></ag-rating>
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

customElements.define("ag-spot-card", AgSpotCard);
