// ag-guide-review-list.js - Хүний сэтгэгдлийн жагсаалт
class AgGuideReviewList extends HTMLElement {
    constructor() {
        super();
        this.reviews = [];
    }

    connectedCallback() {
        this.css();
        this.loadReviews();
        this.render();
    }

    css() {
        const styles = `
        <style>
            .review-section {
                padding: var(--p-lg);
            }

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
                height: fit-content;
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
                min-height: 60px;
                resize: vertical;
            }

            .submit-btn {
                background-color: var(--primary);
                color: white;
                border: none;
                padding: 6px 12px;
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
                font-size: var(--fs-xl);
                color: var(--text-color-0);
                margin-bottom: var(--p-lg);
            }
        </style>
        `;

        if (!document.querySelector('#ag-guide-review-list-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'ag-guide-review-list-styles';
            styleElement.textContent = styles.split('<style>')[1].split('</style>')[0];
            document.head.appendChild(styleElement);
        }
    }

    loadReviews() {
        // API эсвэл өгөгдлийн сангаас хүний сэтгэгдлүүдийг ачаалах
        this.reviews = [
            {
                bogin: "Тэмүүжин",
                urt: "Хөтөч нь маш эелдэг, хариуцлагатай байсан. Дараагийн аялалдаа дахин заавал энэ хөтөчийг сонгоно.",
                unelgee: 4.8,
                date: "2024-01-08"
            },
            {
                bogin: "Энхтайван",
                urt: "Хөтөч маш их тэвчээртэй, хүүхдүүдтэйгээ маш сайн харилцаж чадсан.",
                unelgee: 4.9,
                date: "2024-01-02"
            },
            {
                bogin: "Жаргал",
                urt: "Байгалийн үзэсгэлэнт газруудыг маш сайн харуулсан. Хөтөч нь маш их туршлагатай байсан.",
                unelgee: 4.6,
                date: "2023-12-28"
            }
        ];
    }

    render() {
        this.innerHTML = `
            <section class="review-section">
                <h2 class="section-title">Хүний үнэлгээ & Сэтгэгдэл</h2>
                
                <div class="reviews-container">
                    <div class="comment-form-card">
                        <h3>Сэтгэгдэл үлдээх</h3>
                        <form id="commentForm">
                            <div class="form-group">
                                <label for="name">Нэр</label>
                                <input type="text" id="name" required>
                            </div>
                            <div class="form-group">
                                <label for="comment">Сэтгэгдэл</label>
                                <textarea id="comment" placeholder="Хүний тухай сэтгэгдлээ бичнэ үү..." required></textarea>
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
            this.render();
            this.querySelector('#commentForm').reset();
        }
    }
}

window.customElements.define('ag-guide-review-list', AgGuideReviewList);