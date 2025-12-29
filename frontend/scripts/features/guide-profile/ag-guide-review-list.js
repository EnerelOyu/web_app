// ag-guide-review-list.js - Хүний сэтгэгдлийн жагсаалт
class AgGuideReviewList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.reviews = [];
    }

    async connectedCallback() {
        this.guideId = this.getAttribute('guide-id') || 'default';
        await this.loadReviews();
        this.render();
    }

    getStyles() {
        return `
            @import url('./styles/global.css');
            @import url('./styles/fonts.css');

            .review-section {
                grid-area: rew;
                padding: var(--p-lg);
            }

            .reviews-container {
                display: flex;
                flex-direction: row;
                gap: var(--gap-size-l);
            }

            .comment-form-card {
                background-color: var(--primary-5);
                padding: var(--p-md);
                border-radius: var(--br-s);
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
                overflow-y: scroll;
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
                border-radius: var(--br-s);
            }

            .reviews-scroll::-webkit-scrollbar-thumb {
                background: var(--primary-3);
                border-radius: var(--br-s);
            }

            .reviews-scroll::-webkit-scrollbar-thumb:hover {
                background: var(--primary-2);
            }

            .form-group {
                margin-bottom: var(--p-sm);
            }

            .form-group label {
                display: block;
                margin-bottom: var(--m-xxs);
                font-weight: bold;
                color: var(--text-color-1);
                font-size: var(--fs-xs);
                font-family: 'Rubik';
            }

            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: var(--p-xs) var(--p-sm);
                border: 1px solid var(--text-color-7);
                border-radius: var(--br-s);
                font-size: var(--fs-sm);
                box-sizing: border-box;
            }

            .form-group textarea {
                padding: var(--p-md) var(--p-sm);
            }

            .submit-btn {
                background-color: var(--primary);
                color: white;
                border: none;
                padding: var(--p-xs) var(--p-sm);
                border-radius: var(--br-s);
                cursor: pointer;
                font-family: 'NunitoSans';
                font-size: var(--fs-sm);
                transition: background-color 0.3s ease;
                width: 100%;
            }

            .submit-btn:hover {
                background-color: var(--primary-5);
            }

            .section-title {
                font-family: 'Rubik';
                font-size: var(--fs-xl);
                color: var(--text-color-0);
                margin-bottom: var(--p-lg);
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
        `;
    }

    async loadReviews() {
        try {
            // Fetch reviews from backend API
            const response = await fetch(`http://localhost:3000/api/guides/${this.guideId}/reviews`);

            if (!response.ok) {
                throw new Error('Failed to fetch guide reviews');
            }

            const data = await response.json();

            // Map backend data to frontend format
            this.reviews = data.reviews.map(review => ({
                bogin: review.userName,
                urt: review.comment,
                unelgee: review.rating,
                date: review.createdAt.split('T')[0] // Extract date part from ISO string
            }));

        } catch (error) {
            console.error('Error loading guide reviews from backend:', error);

            // Fallback to default reviews if backend fails
            this.reviews = [
                {
                    bogin: "Тэмүүжин",
                    urt: "Хөтөч нь маш эелдэг, хариуцлагатай байсан. Мэргэжлийн өндөр түвшинд ажилладаг.",
                    unelgee: 4.8,
                    date: "2024-01-08"
                },
                {
                    bogin: "Энхтайван",
                    urt: "Хөтөч маш их тэвчээртэй, хүүхдүүдтэйгээ маш сайн харилцаж чадсан.",
                    unelgee: 4.9,
                    date: "2024-01-02"
                }
            ];
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${this.getStyles()}</style>
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
                                <textarea id="comment" placeholder="Хөтчийн тухай сэтгэгдлээ бичнэ үү..." required></textarea>
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
        const form = this.shadowRoot.querySelector('#commentForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
    }

    // Save review to backend
    async saveReview(userName, comment, rating) {
        try {
            const response = await fetch(`http://localhost:3000/api/guides/${this.guideId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName,
                    comment,
                    rating
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save guide review');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error saving guide review to backend:', error);
            throw error;
        }
    }

    async handleFormSubmit() {
        const name = this.shadowRoot.querySelector('#name').value;
        const comment = this.shadowRoot.querySelector('#comment').value;

        if (name && comment) {
            try {
                // Save to backend
                await this.saveReview(name, comment, 5.0);

                // Reload reviews from backend
                await this.loadReviews();

                // Re-render with updated reviews
                this.render();

                // Show success message
                alert('Сэтгэгдэл амжилттай илгээгдлээ!');
            } catch (error) {
                alert('Сэтгэгдэл хадгалахад алдаа гарлаа. Дахин оролдоно уу.');
            }
        }
    }
}

window.customElements.define('ag-guide-review-list', AgGuideReviewList);