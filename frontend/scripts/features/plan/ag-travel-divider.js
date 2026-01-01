/**
 * ========================================
 * AgTravelDivider - Аяллын газрууд хоорондын зай
 * ========================================
 *
 * Энэхүү компонент нь аяллын газрууд хоорондох зай, хугацааг харуулж,
 * шинэ газар эсвэл тэмдэглэл нэмэх боломж олгоно.
 * Хэрэглэгч дараах үйлдлүүдийг хийх боломжтой:
 * - Зай, хугацааны мэдээлэл харах
 * - Газар нэмэх
 * - Тэмдэглэл нэмэх
 * - Нэмэх төрлийг солих
 */
class AgTravelDivider extends HTMLElement {
    /**
     * constructor - Компонентыг үүсгэх
     *
     * Үүрэг:
     * 1. HTMLElement-ийн constructor-ийг дуудна
     * 2. Shadow DOM үүсгэнэ
     * 3. Анхдагч нэмэх төрлийг 'place' болгож тохируулна
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.addType = 'place';
    }

    /**
     * observedAttributes - Хянах шинж чанаруудын жагсаалт
     *
     * Үүрэг:
     * Эдгээр атрибутууд өөрчлөгдөх үед attributeChangedCallback автоматаар ажиллана
     *
     * @returns {Array<string>} - Хянах атрибутуудын жагсаалт
     */
    static get observedAttributes() {
        return ['time', 'distance'];
    }

    /**
     * connectedCallback - Компонент DOM-д холбогдох үед автоматаар ажиллана
     *
     * Үүрэг:
     * 1. Компонентыг дүрсэлнэ (render)
     * 2. Event listener-ууд суулгана
     */
    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    /**
     * attributeChangedCallback - Атрибут өөрчлөгдөх үед ажиллах
     *
     * Үүрэг:
     * time эсвэл distance атрибут өөрчлөгдвөл компонентыг дахин дүрсэлнэ
     *
     * @param {string} name - Өөрчлөгдсөн атрибутын нэр
     * @param {string} oldValue - Хуучин утга
     * @param {string} newValue - Шинэ утга
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
            this.attachEventListeners();
        }
    }

    /**
     * time getter - Зам дээрх хугацаа
     *
     * @returns {string} - Хугацааны утга (жишээ: "2 цаг")
     */
    get time() {
        return this.getAttribute('time') || '';
    }

    /**
     * distance getter - Зам дээрх зай
     *
     * @returns {string} - Зайн утга (жишээ: "150 км")
     */
    get distance() {
        return this.getAttribute('distance') || '';
    }

    /**
     * travelText getter - Харуулах текст үүсгэх
     *
     * Үүрэг:
     * Хугацаа болон зай байвал хамтад нь харуулна, үгүй бол "Тооцоолж байна..."
     *
     * @returns {string} - Харуулах текст
     */
    get travelText() {
        if (this.time && this.distance) {
            return `${this.time} · ${this.distance}`;
        }
        return 'Тооцоолж байна...';
    }

    /**
     * isEmpty getter - Хоосон эсэхийг шалгах
     *
     * Үүрэг:
     * Хугацаа болон зай хоёулаа байхгүй бол хоосон гэж үзнэ
     *
     * @returns {boolean} - Хоосон бол true, биш бол false
     */
    get isEmpty() {
        return !this.time && !this.distance;
    }

    /**
     * render - Компонентыг дүрсэлэх
     *
     * Үүрэг:
     * 1. Shadow DOM руу HTML бичнэ
     * 2. Хэвтээ болон босоо зураас үүсгэнэ
     * 3. Газар/тэмдэглэл нэмэх товчуудыг харуулна
     */
    render() {
        const styles = `
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
                opacity: 0;
                transition: opacity 0.2s;
            }

            .divider-line-vertical {
                position: absolute;
                width: 2px;
                left: 10px;
                top: 0;
                bottom: 0;
                background: repeating-linear-gradient(to bottom, var(--text-color-7, #ddd) 0, var(--text-color-7, #ddd) 5px, transparent 5px, transparent 10px);
                opacity: 0.6;
                transition: opacity 0.2s;
            }

            .divider-controls {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
            }

            .add-prompt {
                display: flex;
                align-items: center;
                gap: var(--gap-size-s, 0.75rem);
                background: var(--bg-color, #fff);
                border: 1px solid var(--text-color-7, #ddd);
                border-radius: 999px;
                padding: 0.25rem 0.5rem 0.25rem 0.6rem;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease;
                z-index: 2;
            }

            :host(:hover) .divider-line-horizontal {
                opacity: 1;
            }

            :host(:hover) .divider-line-vertical {
                opacity: 0.6;
            }

            :host(:hover) .add-prompt {
                opacity: 1;
                pointer-events: auto;
            }

            .prompt-text {
                font-family: 'NunitoSans', sans-serif;
                font-size: var(--fs-sm, 0.875rem);
                color: var(--text-color-3, #666);
                white-space: nowrap;
            }

            .add-label-btn {
                background: var(--bg-color, #fff);
                border: 1px solid var(--text-color-7, #ddd);
                border-radius: var(--br-pill, 999px);
                display: flex;
                align-items: center;
                gap: var(--gap-size-xs, 0.5rem);
                color: var(--text-color-2, #555);
                cursor: pointer;
                transition: all var(--transition-fast, 0.2s) ease;
                padding: var(--p-xs, 0.3rem) var(--p-sm, 0.65rem);
                font-family: var(--font-sans, 'NunitoSans', sans-serif);
                font-size: var(--fs-sm, 0.875rem);
            }

            .add-label-btn svg {
                width: var(--svg-icon-size, 14px);
                height: var(--svg-icon-size, 14px);
                fill: currentColor;
                flex-shrink: 0;
            }

            .add-label-btn:hover {
                border-color: var(--primary, #ff6b00);
                color: var(--primary, #ff6b00);
                transform: scale(1.05);
            }

            @media (max-width: 768px) {
                .prompt-text {
                    display: none;
                }
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            <div class="divider-line-horizontal"></div>
            <div class="divider-controls">
                <div class="divider-line-vertical"></div>
                <div class="add-prompt">
                    <span class="prompt-text">Энд юм нэмэх үү?</span>
                    <button class="add-label-btn add-place-btn" data-action="add" data-type="place" aria-label="Газар нэмэх">
                        <svg viewBox="0 0 384 512" aria-hidden="true">
                            <path fill="currentColor" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
                        </svg>
                        <span>Газар</span>
                    </button>
                    <button class="add-label-btn add-note-btn" data-action="add" data-type="note" aria-label="Тэмдэглэл нэмэх">
                        <svg viewBox="0 0 448 512" aria-hidden="true">
                            <path fill="currentColor" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L274.7 69.3c-12-12-28.3-18.7-45.3-18.7H64zm0 96c0-17.7 14.3-32 32-32H208c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM96 320a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM224 416a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM96 448a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                        </svg>
                        <span>Тэмдэглэл</span>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * attachEventListeners - Event listener-ууд суулгах
     *
     * Үүрэг:
     * 1. Listener-ууд давхар суухаас сэргийлнэ
     * 2. Газар/тэмдэглэл нэмэх event listener суулгана
     */
    attachEventListeners() {
        // Listener-ууд давхар суухаас сэргийлэх
        if (this._listenersAttached) return;
        this._listenersAttached = true;

        const shadow = this.shadowRoot;

        /**
         * Click event listener - Товч дарахад ажиллах
         *
         * Үүрэг:
         * 1. Дарагдсан товчийг олох
         * 2. add action бол add-item event дамжуулах (type-ийг data-type атрибутаас авна)
         */
        shadow.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('[data-action]');
            if (!actionBtn) return;

            const action = actionBtn.dataset.action;

            // add action - Газар/тэмдэглэл нэмэх event дамжуулах
            if (action === 'add') {
                // data-type атрибутаас type-ийг авна
                const type = actionBtn.dataset.type || this.addType;
                this.dispatchEvent(new CustomEvent('add-item', {
                    bubbles: true,
                    composed: true,
                    detail: { type, divider: this }
                }));
            }
        });
    }
}

// Компонентыг бүртгэх - <ag-travel-divider> тагийг ашиглах боломжтой болгоно
customElements.define('ag-travel-divider', AgTravelDivider);
