// Travel Divider Component
class AgTravelDivider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['time', 'distance'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    get time() {
        return this.getAttribute('time') || '';
    }

    get distance() {
        return this.getAttribute('distance') || '';
    }

    get travelText() {
        if (this.time && this.distance) {
            return `${this.time} · ${this.distance}`;
        }
        return 'Тооцоолж байна...';
    }

    get isEmpty() {
        return !this.time && !this.distance;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import url('/styles/fonts.css');

                :host {
                    display: block;
                    position: relative;
                    min-height: 50px;
                    margin: var(--m-sm, 1rem) 0;
                }

                :host([hidden]) {
                    display: none;
                }

                .divider-line-horizontal {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 50%;
                    height: 2px;
                    background: repeating-linear-gradient(to right, var(--text-color-7, #ddd) 0, var(--text-color-7, #ddd) 5px, transparent 5px, transparent 10px);
                    opacity: 0.6;
                    transition: opacity 0.2s;
                }

                .divider-line-vertical {
                    position: absolute;
                    width: 2px;
                    top: 0;
                    bottom: 0;
                    background: repeating-linear-gradient(to bottom, var(--text-color-7, #ddd) 0, var(--text-color-7, #ddd) 5px, transparent 5px, transparent 10px);
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                :host(:hover) .divider-line-horizontal {
                    opacity: 1;
                }

                :host(:hover) .divider-line-vertical {
                    opacity: 0.6;
                }

                .divider-controls {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                }

                .travel-info {
                    display: flex;
                    align-items: center;
                    gap: var(--gap-size-s, 0.75rem);
                    flex: 1;
                }

                .travel-mode-btn {
                    background: var(--bg-color, #fff);
                    border: 1px solid var(--text-color-7, #ddd);
                    border-radius: var(--br-s, 8px);
                    padding: var(--p-xs, 0.5rem) var(--p-sm, 0.75rem);
                    display: flex;
                    align-items: center;
                    gap: var(--gap-size-xs, 0.25rem);
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: var(--fs-sm, 0.875rem);
                    color: var(--text-color-2, #555);
                    font-family: 'NunitoSans', sans-serif;
                }

                .travel-mode-btn:hover {
                    border-color: var(--primary, #ff6b00);
                    background: var(--primary-5, rgba(255, 107, 0, 0.05));
                }

                .travel-icon {
                    width: 18px;
                    height: 18px;
                    fill: var(--text-color-3, #666);
                }

                .travel-text {
                    color: var(--text-color-2, #555);
                    font-weight: 500;
                }

                .caret-icon {
                    width: 12px;
                    height: 12px;
                    fill: var(--text-color-4, #888);
                    margin-left: var(--p-xxs, 0.125rem);
                }

                .directions-link {
                    color: var(--text-color-3, #666);
                    font-size: var(--fs-sm, 0.875rem);
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.2s;
                }

                .directions-link:hover {
                    color: var(--primary, #ff6b00);
                    text-decoration: underline;
                }

                @media (max-width: 768px) {
                    .travel-mode-btn {
                        font-size: var(--fs-xs, 0.75rem);
                        padding: var(--p-xxs, 0.25rem) var(--p-xs, 0.5rem);
                    }

                    .travel-text {
                        font-size: var(--fs-xs, 0.75rem);
                    }
                }
            </style>

            <div class="divider-line-horizontal"></div>
            <div class="divider-controls">
                <div class="divider-line-vertical"></div>
                <div class="travel-info">
                    <button class="travel-mode-btn" title="Зам харах">
                        <svg viewBox="0 0 512 512" class="travel-icon">
                            <path fill="currentColor" d="M135.2 117.4l-26.1 74.6 293.8 0-26.1-74.6C372.3 104.6 360.2 96 346.6 96L165.4 96c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32l181.2 0c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2l0 192c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32-320 0 0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32L0 256c0-26.7 16.4-49.6 39.6-59.2zM128 304a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
                        </svg>
                        <span class="travel-text">${this.travelText}</span>
                        <svg viewBox="0 0 384 512" class="caret-icon">
                            <path fill="currentColor" d="M352 160c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-160 160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-9.2-9.2-11.9-22.9-6.9-34.9S19.1 160 32 160l320 0z"/>
                        </svg>
                    </button>
                    <a href="https://www.google.com/maps/dir/?api=1" target="_blank" class="directions-link">Чиглэл</a>
                </div>
            </div>
        `;
    }
}

customElements.define('ag-travel-divider', AgTravelDivider);
