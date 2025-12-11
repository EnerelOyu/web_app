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
        this.reviews = [
            {
                bogin: "Тэмүүжин",
                urt: "Хөтөч нь маш эелдэг, хариуцлагатай байсан. Мэргэжлийн өндөр түвшинд ажилладаг. Дараагийн аялалдаа дахин заавал энэ хөтөчийг сонгоно.",
                unelgee: 4.8,
                date: "2024-01-08"
            },
            {
                bogin: "Энхтайван",
                urt: "Хөтөч маш их тэвчээртэй, хүүхдүүдтэйгээ маш сайн харилцаж чадсан. Аяллын үеэр бүх асуултанд хариулсан.",
                unelgee: 4.9,
                date: "2024-01-02"
            },
            {
                bogin: "Жаргал",
                urt: "Байгалийн үзэсгэлэнт газруудыг маш сайн харуулсан. Хөтөч нь маш их туршлагатай байсан. Түүх соёлын мэдлэг гүнзгий.",
                unelgee: 4.6,
                date: "2023-12-28"
            },
            {
                bogin: "Баярмаа",
                urt: "Хөтөч нь маш идэвхтэй, хөгжилтэй байсан. Аяллын үеэр уйтгартай мөч байсангүй. Бүх зүйл маш сайн зохион байгуулалттай.",
                unelgee: 5.0,
                date: "2023-12-25"
            },
            {
                bogin: "Гантулга",
                urt: "Мэргэжлийн хандалт, өндөр чадвартай. Аяллын явцад аюулгүй байдлыг маш сайн хангасан. Найдвартай хөтөч.",
                unelgee: 4.7,
                date: "2023-12-20"
            },
            {
                bogin: "Цэцэг",
                urt: "Хэлний чадвар сайн, олон улсын жуулчдад тохиромжтой. Харилцааны ур чадвар өндөр. Маш их таалагдлаа.",
                unelgee: 4.8,
                date: "2023-12-18"
            },
            {
                bogin: "Бат-Эрдэнэ",
                urt: "Байгалийн талаар гүнзгий мэдлэгтэй. Амьтны аймгийн талаар сонирхолтой баримтуудыг хуваалцсан. Сонирхолтой аялал боллоо.",
                unelgee: 4.5,
                date: "2023-12-15"
            },
            {
                bogin: "Нандин",
                urt: "Хөтөч нь маш анхааралтай, жуулчдын хэрэгцээг ойлгодог. Аяллын хөтөлбөрийг уян хатан зохион байгуулсан. Маш сайн.",
                unelgee: 4.9,
                date: "2023-12-12"
            },
            {
                bogin: "Эрдэнэбат",
                urt: "Түргэн шуурхай, үр дүнтэй ажилладаг. Цаг хугацааны удирдлага сайн. Бүх зорилгоо биелүүлсэн.",
                unelgee: 4.6,
                date: "2023-12-10"
            },
            {
                bogin: "Сүхбат",
                urt: "Аяллын үеэр гарч болзошгүй аливаа нөхцөл байдлыг маш сайн удирдан зохион байгуулдаг. Найдвартай, итгэлтэй хөтөч.",
                unelgee: 4.7,
                date: "2023-12-08"
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