class GuideCard extends HTMLElement {
    constructor() {
        super();
    }

    applyStyles() {
        const styles = `
        <style>
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
        </style>`;

        if (!document.querySelector('#guide-card-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'guide-card-styles';
            styleElement.textContent = styles.split('<style>')[1].split('</style>')[0];
            document.head.appendChild(styleElement);
        }
    }

    connectedCallback() {
        this.render();
        this.applyStyles();

        // Автоматаар guide-id attribute-аас мэдээлэл унших
        const guideId = this.getAttribute('guide-id');
        if (guideId) {
            this.setGuide(guideId);
        }
    }

    // Attribute өөрчлөгдөх үед шинэчлэх
    static get observedAttributes() {
        return ['guide-id'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'guide-id' && newValue && oldValue !== newValue) {
            this.setGuide(newValue);
        }
    }

    render() {
        this.innerHTML = `
            <div class="guide-card" id="guideCard">
                <img id="guidePhoto" src="" alt="Guide photo">
                <div class="guide-details">
                    <h4 id="guideName">Хөтөчийн нэр</h4>
                    <div class="guide-rating">
                        <ag-rating id="guideRating"></ag-rating>
                    </div>
                    <p class="guide-meta"><strong>Туршлага:</strong> <span id="guideExperience"></span></p>
                    <p class="guide-meta"><strong>Хэл:</strong> <span id="guideLanguages"></span></p>
                    <p class="guide-meta"><strong>Төрсөн огноо:</strong> <span id="guideBirthdate"></span></p>
                    <p class="guide-meta"><strong>Утас:</strong> <a id="guidePhone" href="#"></a></p>
                </div>
            </div>
        `;
    }

    setGuide(guideId) {
        // Get guide from app-state
        const guide = window.appState?.getGuide(guideId);
        if (!guide) {
            console.warn(`Guide with ID "${guideId}" not found`);
            return;
        }

        // Render хийгдээгүй бол render хийнэ
        if (!this.querySelector('#guideCard')) {
            this.render();
        }

        const imgSrc = guide.profileImg || '../assets/images/guide-img/default-profile.svg';
        console.log(`Loading guide ${guide.fullName}, image: ${imgSrc}`);

        this.querySelector('#guidePhoto').src = imgSrc;
        this.querySelector('#guidePhoto').alt = `${guide.fullName} хөтөч`;
        this.querySelector('#guideName').textContent = guide.fullName;
        this.querySelector('#guideExperience').textContent = guide.experience;
        this.querySelector('#guideLanguages').textContent = guide.languages.join(', ');
        this.querySelector('#guideBirthdate').textContent = '-'; // birthdate хадгалагдаагүй

        const phoneLink = this.querySelector('#guidePhone');
        phoneLink.textContent = guide.phone;
        phoneLink.href = `tel:${guide.phone.replace(/\s+/g, '')}`;

        const ratingElement = this.querySelector('#guideRating');
        if (ratingElement) {
            // Rating guides.json-д байхгүй тул default 4.5
            ratingElement.setAttribute('value', '4.5');
        }
    }


}

customElements.define('ag-guide-card', GuideCard);