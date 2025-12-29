class PageGuideProfile extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.css = `
      @import url('./styles/global.css');
      @import url('./styles/fonts.css');

      .page-guide-profile {
        display: flex;
        flex-direction: column;
        gap: var(--m-md);
        margin: var(--m-md);
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
      }

      /* HEADER SECTION */
      .guide-profile-header {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--gap-size-l);
        padding: var(--p-xl);
        border-radius: var(--br-m);
        background: var(--bg-color);
        border: 2px solid var(--text-color-8);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        align-items: start;
      }

      .guide-profile-image {
        width: 200px;
        height: 200px;
        border-radius: var(--br-circle);
        object-fit: cover;
        border: 4px solid var(--text-color-8);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .guide-profile-info {
        display: flex;
        flex-direction: column;
        gap: var(--gap-size-m);
      }

      .guide-profile-name {
        font-size: var(--fs-xxl);
        font-weight: 700;
        color: var(--text-color-0);
        margin: 0;
        font-family: 'Rubik';
      }

      .guide-profile-rating {
        display: flex;
        align-items: center;
        gap: var(--gap-size-s);
      }

      .guide-profile-meta {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--gap-size-m);
        margin-top: var(--m-sm);
      }

      .guide-meta-item {
        display: flex;
        flex-direction: column;
        gap: var(--gap-size-xs);
      }

      .guide-meta-label {
        font-size: var(--fs-sm);
        color: var(--text-color-3);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-family: 'Rubik';
      }

      .guide-meta-value {
        font-size: var(--fs-md);
        color: var(--text-color-1);
        font-weight: 600;
        font-family: 'NunitoSans';
      }

      .guide-meta-value a {
        color: var(--primary);
        text-decoration: none;
        transition: color 0.3s ease;
      }

      .guide-meta-value a:hover {
        color: var(--primary-1);
        text-decoration: underline;
      }

      /* CONTACT SECTION */
      .guide-contact-section {
        display: flex;
        gap: var(--gap-size-m);
        margin-top: var(--m-md);
      }

      .guide-contact-btn {
        padding: var(--p-md) var(--p-lg);
        border-radius: var(--br-m);
        border: 2px solid var(--primary);
        background: var(--primary);
        color: white;
        font-size: var(--fs-md);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: var(--gap-size-s);
        font-family: 'Rubik';
      }

      .guide-contact-btn svg {
        width: var(--svg-m);
        height: var(--svg-m);
        fill: var(--text-color-0);
      }

      .guide-contact-btn.secondary svg {
        color: var(--primary);
      }

      .guide-contact-btn:hover {
        background: var(--primary-1);
        border-color: var(--primary-1);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .guide-contact-btn.secondary {
        background: transparent;
        color: var(--primary);
      }

      .guide-contact-btn.secondary:hover {
        background: var(--primary-5);
      }

      /* DETAILS SECTIONS */
      .guide-section-card {
        padding: var(--p-lg);
        border-radius: var(--br-m);
        background: var(--bg-color);
        border: 2px solid var(--text-color-8);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      }

      .guide-section-title {
        font-size: var(--fs-lg);
        text-transform: uppercase;
        font-family: 'Rubik';
        font-weight: 500;
        color: var(--text-color-2);
        margin-bottom: var(--m-sm);
        border-bottom: 2px solid var(--text-color-8);
        padding-bottom: var(--p-sm);
      }

      .guide-section-content {
        font-size: var(--fs-md);
        line-height: 1.8;
        color: var(--text-color-2);
        font-family: 'NunitoSans';
      }

      .guide-section-content p {
        margin: var(--m-sm) 0;
      }

      /* BACK BUTTON */
      .back-button {
        display: inline-flex;
        align-items: center;
        gap: var(--gap-size-s);
        padding: var(--p-sm) var(--p-md);
        border-radius: var(--br-s);
        background: transparent;
        border: none;
        color: var(--text-color-2);
        font-size: var(--fs-md);
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        font-family: 'Rubik';
        align-self: flex-start;
      }

      .back-button:hover {
        background: var(--text-color-9);
        transform: translateX(-4px);
      }

      /* RESPONSIVE */
      @media (max-width: 960px) {
        .page-guide-profile {
          margin: var(--m-sm);
        }

        .guide-profile-header {
          grid-template-columns: 1fr;
          text-align: center;
          justify-items: center;
          padding: var(--p-lg);
        }

        .guide-profile-image {
          width: 150px;
          height: 150px;
        }

        .guide-profile-meta {
          grid-template-columns: 1fr;
        }

        .guide-contact-section {
          flex-direction: column;
        }
      }

      @media (max-width: 600px) {
        .guide-profile-header {
          padding: var(--p-md);
        }

        .guide-profile-image {
          width: 120px;
          height: 120px;
        }

        .guide-profile-name {
          font-size: var(--fs-xl);
        }

        .guide-section-card {
          padding: var(--p-md);
        }

        .back-button {
          padding: var(--p-xs) var(--p-sm);
          font-size: var(--fs-sm);
        }
      }
    `;
  }

  async connectedCallback() {
    await this.render();

    // Listen for app state changes
    window.addEventListener("appstatechange", async (e) => {
      if (e.detail.key === "guideData") {
        await this.render();
      }
    });

    // Listen for new review added event to update rating
    window.addEventListener("guide-review-added", async (e) => {
      // Re-render to update the rating display
      await this.render();
    });
  }

  async fetchGuideReviews(guideId) {
    try {
      const response = await fetch(`http://localhost:3000/api/guides/${guideId}/reviews`);
      if (!response.ok) {
        throw new Error('Failed to fetch guide reviews');
      }
      const data = await response.json();
      return data.reviews;
    } catch (error) {
      console.error('Error fetching guide reviews:', error);
      return [];
    }
  }

  calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) {
      return { average: 0, count: 0 };
    }
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / reviews.length;
    return { average: Math.round(average * 10) / 10, count: reviews.length };
  }

  async render() {
    // Get guide ID from URL
    const queryString = window.location.hash.split('?')[1] || '';
    const urlParams = new URLSearchParams(queryString);
    const guideId = urlParams.get('g');

    if (!guideId) {
      this.shadowRoot.innerHTML = `
        <style>${this.css}</style>
        <div class="page-guide-profile">
          <p>Хөтөч олдсонгүй.</p>
        </div>
      `;
      return;
    }

    const guide = window.appState?.getGuide(guideId);

    if (!guide) {
      this.shadowRoot.innerHTML = `
        <style>${this.css}</style>
        <div class="page-guide-profile">
          <a href="#/spots" class="back-button">← Буцах</a>
          <p>Хөтөч олдсонгүй.</p>
        </div>
      `;
      return;
    }

    // Fetch guide reviews and calculate average rating
    const reviews = await this.fetchGuideReviews(guideId);
    const { average, count } = this.calculateAverageRating(reviews);

    this.shadowRoot.innerHTML = `
      <style>${this.css}</style>
      <div class="page-guide-profile">
        <a href="javascript:history.back()" class="back-button">← Буцах</a>

        <!-- HEADER SECTION -->
        <section class="guide-profile-header">
          <img
            src="${guide.profileImg || '../assets/images/guide-img/default-profile.svg'}"
            alt="${guide.fullName}"
            class="guide-profile-image"
          />

          <div class="guide-profile-info">
            <h1 class="guide-profile-name">${guide.fullName}</h1>

            <div class="guide-profile-rating">
              <ag-rating value="${average || 0}"></ag-rating>
              <span style="color: var(--text-color-3); font-size: var(--fs-sm);">(${count} үнэлгээ)</span>
            </div>

            <div class="guide-profile-meta">
              <div class="guide-meta-item">
                <span class="guide-meta-label">Туршлага</span>
                <span class="guide-meta-value">${guide.experience}</span>
              </div>

              <div class="guide-meta-item">
                <span class="guide-meta-label">Хэл</span>
                <span class="guide-meta-value">${guide.languages.join(', ')}</span>
              </div>

              <div class="guide-meta-item">
                <span class="guide-meta-label">Бүс нутаг</span>
                <span class="guide-meta-value">${guide.area}</span>
              </div>

              <div class="guide-meta-item">
                <span class="guide-meta-label">Төрөл</span>
                <span class="guide-meta-value">${guide.category}</span>
              </div>

              <div class="guide-meta-item">
                <span class="guide-meta-label">Утас</span>
                <span class="guide-meta-value"><a href="tel:${guide.phone ? guide.phone.replace(/\s+/g, '') : ''}">${guide.phone || 'Байхгүй'}</a></span>
              </div>

              <div class="guide-meta-item">
                <span class="guide-meta-label">И-мэйл</span>
                <span class="guide-meta-value"><a href="mailto:${guide.email}">${guide.email}</a></span>
              </div>
            </div>

            <div class="guide-contact-section">
              <a href="tel:${guide.phone ? guide.phone.replace(/\s+/g, '') : ''}" class="guide-contact-btn">
                <svg><use href="/styles/icons.svg#icon-phone"></use></svg>
                Залгах
              </a>
              <a href="mailto:${guide.email}" class="guide-contact-btn secondary">
                <svg><use href="../styles/icons.svg#icon-mail"></use></svg>
                И-мэйл илгээх
              </a>
            </div>
          </div>
        </section>

        <!-- REVIEWS SECTION -->
        <ag-guide-review-list guide-id="${guideId}"></ag-guide-review-list>
      </div>
    `;
  }
}

customElements.define("ag-page-guide-profile", PageGuideProfile);
