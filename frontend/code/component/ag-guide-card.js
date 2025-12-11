class GuideCard extends HTMLElement {
    constructor() {
        super();
        this.guides = [
            {
                id: 'g1',
                name: 'Дорж',
                phone: '+97690909909',
                experience: '5 жил',
                languages: 'Монгол, Англи',
                birthdate: '1990-05-15',
                photo: '../files/guide-img/guide1.svg',
                rating: 4.5
            },
            {
                id: 'g2',
                name: 'Саран',
                phone: '+97699001122',
                experience: '3 жил',
                languages: 'Монгол, Англи, Орос',
                birthdate: '1992-08-20',
                photo: '../files/guide-img/guide2.svg',
                rating: 4.8
            },
            {
                id: 'g3',
                name: 'Бат',
                phone: '+97688812233',
                experience: '7 жил',
                languages: 'Монгол, Япон',
                birthdate: '1988-12-10',
                photo: '../files/guide-img/guide3.svg',
                rating: 4.2
            }
        ];
    }

    applyStyles() {
        const styles = `
        <style>
            .guide-card {
                display: flex;
                gap: var(--p-md);
                padding: var(--p-lg);
                border-radius: var(--br-m);
                background: var(--bg-color);
                border: 2px solid var(--text-color-8);
                box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                align-items: flex-start;
                animation: fadeIn 0.3s ease;
            }
            .guide-card img {
                width: fit content;
                ratio: 1/1;
                border-radius: var(--br-circle);
                object-fit: cover;
                flex-shrink: 0;
            }

            .guide-details {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: var(--p-sm);
            }

            .guide-details h4 {
                margin: 0;
                font-size: var(--fs-lg);
                font-weight: 600;
                color: var(--text-color-0);
                line-height: 1.3;
            }

            .guide-rating {
                display: flex;
                align-items: center;
                gap: var(--p-sm);
            }

            .guide-meta {
                margin: 0;
                font-size: var(--fs-sm);
                color: var(--text-color-3);
                line-height: 1.5;
                font-family: 'Rubik';
            }

            .guide-meta strong {
                color: var(--text-color-1);
            }

            .guide-meta a {
                color: var(--primary);
                text-decoration: none;
                transition: color 0.3s ease;
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
                .guide-card {
                    flex-direction: column;
                    text-align: center;
                    gap: var(--p-md);
                    padding: var(--p-md);
                }
                
                .guide-card-left img {
                    width: 100px;
                    height: 100px;
                    margin: 0 auto;
                }
                
                .change-guide-btn {
                    opacity: 1;
                }
            }

            @media (max-width: 480px) {
                .guide-card {
                    padding: var(--p-sm);
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
                <img id="guidePhoto" src="" alt="Guide photo">
            </div>
        `;
    }

    setGuide(guideId) {
        const guide = this.guides.find(g => g.id === guideId);
        if (!guide) {
            console.warn(`Guide with ID "${guideId}" not found`);
            return;
        }

        // Render хийгдээгүй бол render хийнэ
        if (!this.querySelector('#guideCard')) {
            this.render();
        }

        this.querySelector('#guidePhoto').src = guide.photo;
        this.querySelector('#guidePhoto').alt = `${guide.name} хөтөч`;
        this.querySelector('#guideName').textContent = guide.name;
        this.querySelector('#guideExperience').textContent = guide.experience;
        this.querySelector('#guideLanguages').textContent = guide.languages;
        this.querySelector('#guideBirthdate').textContent = guide.birthdate;

        const phoneLink = this.querySelector('#guidePhone');
        phoneLink.textContent = guide.phone;
        phoneLink.href = `tel:${guide.phone.replace(/\s+/g, '')}`;

        const ratingElement = this.querySelector('#guideRating');
        if (ratingElement) {
            ratingElement.setAttribute('value', guide.rating.toString());
        }
    }

    // Гаднаас guides өгөгдөл тохируулах
    setGuidesData(guidesArray) {
        if (Array.isArray(guidesArray)) {
            this.guides = guidesArray;
        }
    }


}

customElements.define('ag-guide-card', GuideCard);