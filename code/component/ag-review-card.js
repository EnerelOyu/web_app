// ag-review.js - Сэтгэгдлийн карт компонент
class AgReview extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.css();
        this.render();
        this.addEventListeners();
    }

    css() {
        const styles = `
        <style>
            .review-card {
                background-color: var(--primary-5);
                padding: var(--p-md);
                font-family: 'NunitoSans';
                color: var(--text-color-2);
                border-radius: var(--br-s);
                min-width: 280px;
                max-width: 320px;
                flex-shrink: 0;
            }

            .comment-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--p-sm);
                gap: var(--gap-size-s);
                flex-wrap: wrap;
            }

            .comment-author {
                font-weight: bold;
                color: var(--text-color-1);
                font-size: var(--fs-sm);
            }

            .comment-date {
                color: var(--text-color-4);
                font-size: var(--fs-xs);
            }

            .comment-text {
                margin-bottom: var(--p-sm);
                line-height: 1.5;
                font-size: var(--fs-sm);
            }

            .comment-text.truncated {
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .see-more {
                background: none;
                border: none;
                color: var(--primary);
                cursor: pointer;
                font-size: var(--fs-xs);
                padding: 0;
                text-decoration: underline;
            }
        </style>
        `;

        if (!document.querySelector('#ag-review-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'ag-review-styles';
            styleElement.textContent = styles.split('<style>')[1].split('</style>')[0];
            document.head.appendChild(styleElement);
        }
    }

    render() {
        const br = this.getAttribute("bogin") || "Гость";
        const lr = this.getAttribute("urt") || "Сэтгэгдэл байхгүй";
        const rating = parseFloat(this.getAttribute("unelgee")) || 0.0;
        const date = this.getAttribute("date") || "2023-08-10";

        this.innerHTML = `
            <article class="review-card">
                <div class="comment-header">
                    <span class="comment-author">${br}</span>
                    <ag-rating value="${rating}" color="var(--primary)"></ag-rating>
                    <span class="comment-date">${date}</span>
                </div>
                <p class="comment-text truncated">${lr}</p>
            </article>
        `;
    }

    addEventListeners() {
        const seeMoreBtn = this.querySelector('.see-more');
        const commentText = this.querySelector('.comment-text');
        
        if (seeMoreBtn && commentText) {
            seeMoreBtn.addEventListener('click', () => {
                this.toggleComment(commentText, seeMoreBtn);
            });
        }
    }

    static get observedAttributes() {
        return ['bogin', 'urt', 'unelgee', 'date'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal !== newVal) {
            this.render();
            this.addEventListeners();
        }
    }
}

window.customElements.define('ag-review', AgReview);