class PageGuides extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.loadGuides();
    }

    render() {
        this.innerHTML = `
            <style>
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
            link.href = '#'; // Could link to profile
            link.className = 'guide-link';

            const card = document.createElement('ag-guide-card');
            card.setAttribute('guide-id', guide.id);

            link.appendChild(card);
            container.appendChild(link);
        });
    }
}

customElements.define('page-guides', PageGuides);
export default PageGuides;