class AgSpotReviewList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.reviews = [];
    }

    async connectedCallback() {
        this.spotId = this.getAttribute('spot-id') || 'default';
        await this.loadReviews();
        this.render();
    }

    getStyles() {
        return `
            @import url('./styles/global.css');
            @import url('./styles/fonts.css');

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
                box-shadow: var(--shadow-m);
                display: flex;
                flex-direction: column;
                gap: var(--gap-size-s);
                flex-shrink: 0;
                position: sticky;
                left: 0;
                z-index: 1;
            }

            .comment-form-card h4 {
                margin: 0;
                font-size: var(--fs-md);
                color: var(--text-color-1);
                font-family: 'Rubik';
            }

            .comment-form-card form {
                display: flex;
                flex-direction: column;
                gap: var(--gap-size-s);
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
                height: var(--scrollbar-height);
            }

            .reviews-scroll::-webkit-scrollbar-track {
                background: var(--primary-5);
                border-radius: var(--br-xs);
            }

            .reviews-scroll::-webkit-scrollbar-thumb {
                background: var(--primary-3);
                border-radius: var(--br-xs);
            }

            .reviews-scroll::-webkit-scrollbar-thumb:hover {
                background: var(--primary-2);
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: var(--gap-size-xs);
            }

            .form-group label {
                font-weight: bold;
                color: var(--text-color-1);
                font-size: var(--fs-xs);
                font-family: 'Rubik';
            }

            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: var(--p-xs) var(--p-sm);
                border: var(--border-width) solid var(--text-color-7);
                border-radius: var(--br-s);
                font-family: 'NunitoSans';
                font-size: var(--fs-sm);
                box-sizing: border-box;
            }

            .form-group textarea {
              max-height: var(--textarea-max-height);
              min-height: var(--textarea-min-height);
              resize: vertical;
            }


            .submit-btn {
                background-color: var(--primary);
                color: var(--primary-5);
                border: none;
                padding: var(--p-sm) var(--p-md);
                border-radius: var(--br-s);
                cursor: pointer;
                font-family: 'NunitoSans';
                font-size: var(--fs-sm);
                transition: background-color 0.3s ease;
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
        `;
    }
    //backend-с сэтгэгдэл татах
    async loadReviews() {
        try {
            const response = await fetch(`http://localhost:3000/api/spots/${this.spotId}/reviews`);

            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }

            const data = await response.json();

            // backend-с ирсэн өгөгдлийг frontend форматаар хөрвүүлэх
            this.reviews = data.reviews.map(review => ({
                bogin: review.userName,
                urt: review.comment,
                unelgee: review.rating,
                date: review.createdAt.split('T')[0] // Extract date part from ISO string
            }));

        } catch (error) {
            console.error('Error loading reviews from backend:', error);
            this.reviews
        }
    }

    // backend-д сэтгэгдэл хадгалах
    async saveReview(userName, comment, rating) {
        try {
            const response = await fetch(`http://localhost:3000/api/spots/${this.spotId}/reviews`, {
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
                throw new Error('Failed to save review');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error saving review to backend:', error);
            throw error;
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${this.getStyles()}</style>
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
                                <label>Үнэлгээ</label>
                                <ag-star-rating-input id="rating-input" value="5"></ag-star-rating-input>
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
        const form = this.shadowRoot.querySelector('#commentForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
    }

    async handleFormSubmit() {
        const name = this.shadowRoot.querySelector('#name').value;
        const comment = this.shadowRoot.querySelector('#comment').value;
        const ratingInput = this.shadowRoot.querySelector('#rating-input');
        const rating = ratingInput ? ratingInput.getValue() : 5.0;

        if (name && comment) {
            try {
                await this.saveReview(name, comment, rating);
                await this.loadReviews();
                this.render();

                window.dispatchEvent(new CustomEvent('spot-review-added', {
                    detail: { spotId: this.spotId }
                }));

                alert('Сэтгэгдэл амжилттай илгээгдлээ!');
            } catch (error) {
                alert('Сэтгэгдэл хадгалахад алдаа гарлаа. Дахин оролдоно уу.');
            }
        }
    }
}

window.customElements.define('ag-spot-review-list', AgSpotReviewList);