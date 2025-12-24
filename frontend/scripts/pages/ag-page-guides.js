class PageGuides extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.loadGuides();
        window.addEventListener('appstatechange', (e) => {
            if (e.detail.key === 'guideData') {
                this.loadGuides();
            }
        });
    }

    render() {
        this.innerHTML = `
            <style>
                @import url('/styles/fonts.css');

                page-guides {
                    display: block;
                    padding: var(--m-lg);
                }

                .guides-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: var(--gap-size-l);
                    margin-top: var(--m-lg);
                }

                .guide-link {
                    text-decoration: none;
                    color: inherit;
                }

                h1 {
                    text-align: center;
                    color: var(--text-color-1);
                    font-family: 'Rubik';
                    text-transform: uppercase;
                    margin-bottom: var(--m-lg);
                }
            </style>

            <h1>Бүх хөтөч</h1>
            <div class="guides-container">
                <!-- Guides will be loaded here -->
            </div>
        `;
    }

    loadGuides() {
        const container = this.querySelector('.guides-container');
        const guides = window.appState?.getAllGuides() || [];

        container.innerHTML = '';

        guides.forEach(guide => {
            const link = document.createElement('a');
            link.href = `#/guide-profile?g=${guide.id}`;
            link.className = 'guide-link';

            const card = document.createElement('ag-guide-card');
            card.setAttribute('guide-id', guide.id);

            link.appendChild(card);
            container.appendChild(link);
        });
    }
}

customElements.define('ag-page-guides', PageGuides);
export default PageGuides;
