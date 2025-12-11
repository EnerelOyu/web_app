// ag-spot-review-list.js - Газрын сэтгэгдлийн жагсаалт
class AgSpotReviewList extends HTMLElement {
    constructor() {
        super();
        this.reviews = [];
    }

    connectedCallback() {
        this.spotId = this.getAttribute('spot-id') || 'default';
        this.css();
        this.loadReviews();
        this.render();
    }

    css() {
        const styles = `
        <style>
            .reviews-container {
                display: flex;
                flex-direction: row;
                gap: var(--gap-size-l);
                align-items: stretch;
            }

            .comment-form-card {
                background-color: var(--primary-5);
                padding: var(--p-md);
                border-radius: var(--br-s);
                min-width: 280px;
                max-width: 320px;
                flex-shrink: 0;
                height: 320px;
                position: sticky;
                left: 0;
                z-index: 1;
            }

            .comment-form-card h3 {
                margin: 0 0 var(--p-sm) 0;
                font-size: var(--fs-md);
                color: var(--text-color-1);
                font-family: 'Rubik';
            }

            .reviews-scroll {
                display: flex;
                flex-direction: row;
                overflow-x: auto;
                gap: var(--gap-size-l);
                padding: var(--p-md) 0;
                scrollbar-width: thin;
                scrollbar-color: var(--primary-3) var(--primary-5);
                flex: 1;
                min-width: 0;
                align-items: stretch;
            }

            .reviews-scroll::-webkit-scrollbar {
                height: 8px;
            }

            .reviews-scroll::-webkit-scrollbar-track {
                background: var(--primary-5);
                border-radius: 4px;
            }

            .reviews-scroll::-webkit-scrollbar-thumb {
                background: var(--primary-3);
                border-radius: 4px;
            }

            .reviews-scroll::-webkit-scrollbar-thumb:hover {
                background: var(--primary-2);
            }

            .form-group {
                margin-bottom: var(--p-sm);
            }

            .form-group label {
                display: block;
                margin-bottom: 4px;
                font-weight: bold;
                color: var(--text-color-1);
                font-size: var(--fs-xs);
                font-family: 'Rubik';
            }

            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: 6px 8px;
                border: 1px solid var(--text-color-7);
                border-radius: var(--br-s);
                font-family: 'NunitoSans';
                font-size: var(--fs-sm);
                box-sizing: border-box;
            }

            .form-group textarea {
              max-height: 100px;
              min-height: 80px;
              resize: vertical;
            }

            .submit-btn {
                background-color: var(--primary);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: var(--br-s);
                cursor: pointer;
                font-family: 'NunitoSans';
                font-size: var(--fs-sm);
                transition: background-color 0.3s ease;
                width: 100%;
            }

            .submit-btn:hover {
                background-color: var(--primary-1);
            }

            .section-title {
                font-family: 'Rubik';
                font-size: var(--fs-lg);
                text-transform: uppercase;
                font-weight: 100;
                color: var(--text-color-2);
                margin-bottom: var(--m-sm);
            }

            ag-review {
                display: block;
            }

            .review-card {
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .comment-text {
                flex: 1;
                overflow: hidden;
            }
        </style>
        `;

        if (!document.querySelector('#ag-spot-review-list-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'ag-spot-review-list-styles';
            styleElement.textContent = styles.split('<style>')[1].split('</style>')[0];
            document.head.appendChild(styleElement);
        }
    }

    loadReviews() {
        // Default reviews for each spot
        const defaultReviews = [
            {
                bogin: "Бат",
                urt: "Гайхалтай байгалийн үзэсгэлэнт газар. Цэвэр агаар, сайхан орчин. Хүмүүс маш эелдэг, тайван. Дахин ирэх дуртай.",
                unelgee: 4.5,
                date: "2024-01-15"
            },
            {
                bogin: "Сараа",
                urt: "Маш их тайван, амралт авахад тохиромжтой газар. Байгалийн үзэсгэлэн нүдэнд үзэсгэлэнтэй. Орчин нөхцөл маш сайн.",
                unelgee: 5.0,
                date: "2024-01-10"
            },
            {
                bogin: "Номин",
                urt: "Байгалийн үзэсгэлэнт газруудыг маш сайн хамгаалж байна. Цэвэрхэн, эмх цэгцтэй. Аялал жуулчлалын үйлчилгээ сайн.",
                unelgee: 4.7,
                date: "2024-01-08"
            },
            {
                bogin: "Эрдэнэ",
                urt: "Газрын байршил маш сайн, хүрэхэд хялбар. Байгалийн баялаг ихтэй. Хөгжүүлэлтийн боломжтой газар.",
                unelgee: 4.3,
                date: "2024-01-05"
            },
            {
                bogin: "Түвшин",
                urt: "Амралт зугаалгаараа ирсэн. Гайхалтай дурсагдах туршлага боллоо. Бүх зүйл маш зохион байгуулалттай.",
                unelgee: 4.8,
                date: "2024-01-03"
            },
            {
                bogin: "Отгонбилэг",
                urt: "Байгалийн үзэмж нь гайхалтай. Хүрээлэн буй орчин цэвэрхэн. Аялалын үйлчилгээний чанар өндөр.",
                unelgee: 4.6,
                date: "2023-12-28"
            },
            {
                bogin: "Болд",
                urt: "Газрын түүх соёлын өв баялаг ихтэй. Сонирхолтой мэдээллүүдийг олж мэдсэн. Дурсамжтай газар.",
                unelgee: 4.4,
                date: "2023-12-25"
            },
            {
                bogin: "Наран",
                urt: "Амралтын өдрүүдээр ирсэн. Маш их тайвшруулсан. Дахин ирэхээр шийдсэн. Зочид буудлын үйлчилгээ сайн.",
                unelgee: 4.9,
                date: "2023-12-20"
            }
        ];

        // Load reviews from localStorage
        try {
            const storageKey = `ayalgo-reviews-${this.spotId}`;
            const savedReviews = localStorage.getItem(storageKey);

            if (savedReviews) {
                const customReviews = JSON.parse(savedReviews);
                // Merge custom reviews with default ones
                this.reviews = [...customReviews, ...defaultReviews];
            } else {
                this.reviews = defaultReviews;
            }
        } catch (error) {
            console.error('Error loading reviews from storage:', error);
            this.reviews = defaultReviews;
        }
    }

    // Save reviews to localStorage
    saveReviews() {
        try {
            const storageKey = `ayalgo-reviews-${this.spotId}`;
            // Save only custom reviews (first ones added by users)
            const defaultCount = 8; // Number of default reviews
            const customReviews = this.reviews.slice(0, this.reviews.length - defaultCount);

            if (customReviews.length > 0) {
                localStorage.setItem(storageKey, JSON.stringify(customReviews));
            }
        } catch (error) {
            console.error('Error saving reviews to storage:', error);
        }
    }

    render() {
        this.innerHTML = `
            <section class="review-section">
                <h3 class="section-title">Газрын үнэлгээ & Сэтгэгдэл</h2>

                <div class="reviews-container">
                    <div class="comment-form-card">
                        <h4>Сэтгэгдэл үлдээх</h3>
                        <form id="commentForm">
                            <div class="form-group">
                                <label for="name">Нэр</label>
                                <input type="text" id="name" required>
                            </div>
                            <div class="form-group">
                                <label for="comment">Сэтгэгдэл</label>
                                <textarea id="comment" placeholder="Газрын тухай сэтгэгдлээ бичнэ үү..." required></textarea>
                            </div>
                            <button type="submit" class="submit-btn">Илгээх</button>
                        </form>
                    </div>

                    <div class="reviews-scroll">
                        ${this.reviews.map(review => `
                            <ag-review 
                                bogin="${review.bogin}"
                                urt="${review.urt}"
                                unelgee="${review.unelgee}"
                                date="${review.date}"
                            ></ag-review>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;

        this.addEventListeners();
    }

    addEventListeners() {
        const form = this.querySelector('#commentForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
    }

    handleFormSubmit() {
        const name = this.querySelector('#name').value;
        const comment = this.querySelector('#comment').value;

        if (name && comment) {
            const newReview = {
                bogin: name,
                urt: comment,
                unelgee: 5.0,
                date: new Date().toISOString().split('T')[0]
            };

            this.reviews.unshift(newReview);
            this.saveReviews();
            this.render();
            this.querySelector('#commentForm').reset();

            // Show success message
            alert('Сэтгэгдэл амжилттай илгээгдлээ!');
        }
    }
}

window.customElements.define('ag-spot-review-list', AgSpotReviewList);