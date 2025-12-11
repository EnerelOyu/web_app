class AgReview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.css = `
      .review-card {
        display: flex;
        flex-direction: column;
        background-color: var(--primary-5);
        padding: var(--p-md);
        color: var(--text-color-2);
        border-radius: var(--br-s);
        gap: var(--gap-size-xs);
        box-shadow: var(--shadow-xs, 0 1px 4px rgb(0 0 0 / 0.06));
      }

      .comment-header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: var(--gap-size-xs);
        margin-bottom: var(--p-sm);
      }

      .comment-info {
        display: flex;
        align-items: center;
        gap: var(--gap-size-s);
      }

      .comment-author {
        font-weight: 600;
        color: var(--text-color-1);
        font-size: var(--fs-sm);
        font-family: 'Rubik';
      }

      .comment-date {
        color: var(--text-color-4);
        font-size: var(--fs-xs);
        white-space: nowrap;
        font-family: 'NunitoSans';
      }

      .comment-text {
        margin-bottom: var(--p-sm);
        line-height: 1.5;
        font-size: var(--fs-sm);
        font-family: 'NunitoSans';
      }

      .comment-text.truncated {
        display: -webkit-box;
        -webkit-line-clamp: var(--review-max-lines, 3);
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .see-more {
        background: none;
        border: none;
        color: var(--link-color, var(--primary));
        cursor: pointer;
        font-size: var(--fs-xs);
        padding: 0;
        text-decoration: underline;
      }

      @media (min-width: 480px) {
        .comment-header {
          flex-direction: row;
          align-items: center;
        }
      }
    `;
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    const br = this.getAttribute("bogin") || "Гость";
    const lr = this.getAttribute("urt") || "Сэтгэгдэл байхгүй";
    const rating = parseFloat(this.getAttribute("unelgee")) || 0.0;
    const date = this.getAttribute("date") || "2023-08-10";

    const css = this.css;

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <article class="review-card">
        <div class="comment-header">
          <span class="comment-author">${br}</span>
          <div class="comment-info">
            <ag-rating value="${rating}" color="var(--primary)"></ag-rating>
            <span class="comment-date">${date}</span>
          </div>
        </div>
        <p class="comment-text truncated">${lr}</p>
      </article>
    `;
  }

  addEventListeners() {
    const seeMoreBtn = this.shadowRoot.querySelector('.see-more');
    const commentText = this.shadowRoot.querySelector('.comment-text');

    if (seeMoreBtn && commentText) {
      seeMoreBtn.addEventListener('click', () => {
        this.toggleComment(commentText, seeMoreBtn);
      });
    }
  }

  toggleComment(commentText, btn) {
    const isTruncated = commentText.classList.contains('truncated');
    if (isTruncated) {
      commentText.classList.remove('truncated');
      btn.textContent = 'Хураах';
    } else {
      commentText.classList.add('truncated');
      btn.textContent = 'Цааш унших';
    }
  }

  static get observedAttributes() {
    return ['bogin', 'urt', 'unelgee', 'date'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal && this.shadowRoot) {
      this.render();
      this.addEventListeners();
    }
  }
}

window.customElements.define('ag-review', AgReview);
