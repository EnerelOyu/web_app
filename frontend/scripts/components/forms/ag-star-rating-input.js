class AgStarRatingInput extends HTMLElement {
    constructor() {
        super();
        this.rating = 5; // Default rating
    }

    connectedCallback() {
        this.rating = parseInt(this.getAttribute('value')) || 5;
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.innerHTML = `
            <style>
                .star-rating-input {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }

                .star-rating-input input[type="radio"] {
                    display: none;
                }

                .star-rating-input label {
                    cursor: pointer;
                    display: inline-block;
                    width: var(--svg-s);
                    height: var(--svg-s);
                    transition: transform 0.2s ease;
                }

                .star-rating-input label:hover {
                    transform: scale(1.1);
                }

                .star-rating-input .star {
                    width: 100%;
                    height: 100%;
                    display: block;
                }

                .star-rating-input .star.filled {
                    color: var(--primary);
                }

                .star-rating-input .star.empty {
                    color: var(--primary-5);
                    stroke: var(--primary);
                    stroke-width: 1;
                }
            </style>
            <div class="star-rating-input">
                ${[1, 2, 3, 4, 5].map(value => `
                    <input type="radio" id="star${value}-${this._uid}" name="rating-${this._uid}" value="${value}" ${value === this.rating ? 'checked' : ''}>
                    <label for="star${value}-${this._uid}">
                        <svg class="star ${value <= this.rating ? 'filled' : 'empty'}">
                            <use href="/styles/icons.svg#icon-star-filled"></use>
                        </svg>
                    </label>
                `).join('')}
            </div>
        `;
    }

    attachEventListeners() {
        const inputs = this.querySelectorAll('input[type="radio"]');
        inputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.rating = parseInt(e.target.value);
                this.updateStars();

                // Dispatch custom event
                this.dispatchEvent(new CustomEvent('rating-changed', {
                    detail: { rating: this.rating },
                    bubbles: true
                }));
            });
        });

        // Hover effect
        const labels = this.querySelectorAll('label');
        labels.forEach((label, index) => {
            label.addEventListener('mouseenter', () => {
                this.highlightStars(index + 1);
            });
        });

        const container = this.querySelector('.star-rating-input');
        container.addEventListener('mouseleave', () => {
            this.updateStars();
        });
    }

    highlightStars(count) {
        const stars = this.querySelectorAll('.star');
        stars.forEach((star, index) => {
            const starValue = index + 1;
            if (starValue <= count) {
                star.classList.remove('empty');
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
                star.classList.add('empty');
            }
        });
    }

    updateStars() {
        this.highlightStars(this.rating);
    }

    getValue() {
        return this.rating;
    }

    get _uid() {
        if (!this.__uid) {
            this.__uid = Math.random().toString(36).substr(2, 9);
        }
        return this.__uid;
    }

    static get observedAttributes() {
        return ['value'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'value' && oldValue !== newValue) {
            this.rating = parseInt(newValue) || 5;
            if (this.isConnected) {
                this.updateStars();
            }
        }
    }
}

customElements.define('ag-star-rating-input', AgStarRatingInput);
