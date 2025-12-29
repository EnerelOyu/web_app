class GuideCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    getStyles() {
        return `
            @import url('./styles/global.css');
            @import url('./styles/fonts.css');

            .guide-card {
                display: flex;
                flex-direction: column;
                gap: var(--p-md);
                padding: var(--p-lg);
                border-radius: var(--br-m);
                background: var(--bg-color);
                border: 2px solid var(--text-color-8);
                box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                align-items: center;
                width: 320px;
                min-width: 320px;
                max-width: 320px;
                box-sizing: border-box;
                flex-shrink: 0;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .guide-card:hover {
                box-shadow: 0 8px 24px rgba(0,0,0,0.12);
                transform: translateY(-2px);
            }

            .guide-card img {
                width: 120px;
                height: 120px;
                border-radius: var(--br-circle);
                object-fit: cover;
                flex-shrink: 0;
                border: 3px solid var(--text-color-8);
                transition: transform 0.3s ease;
            }

            .guide-card:hover img {
                transform: scale(1.05);
            }

            .guide-details {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: var(--p-sm);
                width: 100%;
                text-align: center;
            }

            .guide-details h4 {
                margin: 0;
                font-size: var(--fs-sm);
                color: var(--text-color-1);
                white-space: nowrap;
                overflow: hidden;
            }

            .guide-rating {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--p-sm);
            }

            .guide-meta {
                margin: 0;
                font-size: var(--fs-sm);
                color: var(--text-color-3);
                font-family: 'Rubik';
                text-align: left;
                padding: var(--p-xs) 0;
            }

            .guide-meta strong {
                color: var(--text-color-1);
                display: inline-block;
            }

            .guide-meta a {
                color: var(--primary);
                text-decoration: none;
                transition: color 0.3s ease;
                font-weight: 500;
            }

            .guide-meta a:hover {
                color: var(--primary-1);
                text-decoration: underline;
            }

            /* Animation */
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .guide-card {
                animation: fadeIn 0.4s ease-out;
            }

            /* When guide is selected */
            .guide.has-guide .guide-select {
                opacity: 0;
                height: 0;
                overflow: hidden;
                margin: 0;
                padding: 0;
            }

            .guide.has-guide .guide-card {
                display: flex;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .guide-card img {
                    width: 100px;
                    height: 100px;
                }

                .guide-card {
                    padding: var(--p-md);
                }
            }

            @media (max-width: 480px) {
                .guide-card img {
                    width: 80px;
                    height: 80px;
                }

                .guide-card {
                    padding: var(--p-sm);
                }

                .guide-details h4 {
                    font-size: var(--fs-sm);
                }

                .guide-meta {
                    font-size: var(--fs-xs);
                }

                .guide-meta strong {
                    min-width: 70px;
                }
            }
        `;
    }

    async connectedCallback() {
        this.render();

        // Автоматаар guide-id attribute-аас мэдээлэл унших
        const guideId = this.getAttribute('guide-id');
        if (guideId) {
            await this.setGuide(guideId);
        }
    }

    // Attribute өөрчлөгдөх үед шинэчлэх
    static get observedAttributes() {
        return ['guide-id'];
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'guide-id' && newValue && oldValue !== newValue) {
            await this.setGuide(newValue);
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${this.getStyles()}</style>
            <div class="guide-card" id="guideCard">
                <img id="guidePhoto" src="" alt="Guide photo">
                <div class="guide-details">
                    <h4 id="guideName">Хөтөчийн нэр</h4>
                    <div class="guide-rating">
                        <ag-rating id="guideRating"></ag-rating>
                    </div>
                    <p class="guide-meta"><strong>Туршлага:</strong> <span id="guideExperience"></span></p>
                    <p class="guide-meta"><strong>Хэл:</strong> <span id="guideLanguages"></span></p>
                    <p class="guide-meta"><strong>Утас:</strong> <a id="guidePhone" href="#"></a></p>
                </div>
            </div>
        `;
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
            return 0;
        }
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        const average = sum / reviews.length;
        return Math.round(average * 10) / 10;
    }

    async setGuide(guideId) {
        // Get guide from app-state
        const guide = window.appState?.getGuide(guideId);
        if (!guide) {
            console.warn(`Guide with ID "${guideId}" not found`);
            return;
        }

        // Render хийгдээгүй бол render хийнэ
        if (!this.shadowRoot.querySelector('#guideCard')) {
            this.render();
        }

        const imgSrc = guide.profileImg || '../assets/images/guide-img/default-profile.svg';
        console.log(`Loading guide ${guide.fullName}, image: ${imgSrc}`);

        this.shadowRoot.querySelector('#guidePhoto').src = imgSrc;
        this.shadowRoot.querySelector('#guidePhoto').alt = `${guide.fullName} хөтөч`;
        this.shadowRoot.querySelector('#guideName').textContent = guide.fullName;
        this.shadowRoot.querySelector('#guideExperience').textContent = guide.experience;
        this.shadowRoot.querySelector('#guideLanguages').textContent = guide.languages.join(', ');

        const phoneLink = this.shadowRoot.querySelector('#guidePhone');
        phoneLink.textContent = guide.phone;
        phoneLink.href = `tel:${guide.phone.replace(/\s+/g, '')}`;

        // Fetch reviews and calculate average rating
        const reviews = await this.fetchGuideReviews(guideId);
        const averageRating = this.calculateAverageRating(reviews);

        const ratingElement = this.shadowRoot.querySelector('#guideRating');
        if (ratingElement) {
            ratingElement.setAttribute('value', averageRating || 0);
        }
    }


}

customElements.define('ag-guide-card', GuideCard);