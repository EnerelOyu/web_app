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

            .add-block-btn {
                background: var(--bg-color, #fff);
                color: var(--primary, #ff6b00);
                border: 1px solid var(--text-color-7, #ddd);
                border-radius: var(--br-circle, 50%);
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .add-block-btn svg {
                width: 14px;
                height: 14px;
                fill: currentColor;
            }

            .add-block-btn:hover {
                background: var(--primary, #ff6b00);
                color: var(--bg-color, #fff);
                transform: scale(1.05);
            }

            .add-label-btn {
                background: var(--bg-color, #fff);
                border: 1px solid var(--text-color-7, #ddd);
                border-radius: 999px;
                padding: 0.3rem 0.65rem;
                font-family: 'NunitoSans', sans-serif;
                font-size: var(--fs-sm, 0.875rem);
                color: var(--text-color-2, #555);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .add-label-btn:hover {
                border-color: var(--primary, #ff6b00);
                color: var(--primary, #ff6b00);
            }

            .add-toggle-btn {
                background: var(--bg-color, #fff);
                border: 1px solid var(--text-color-7, #ddd);
                border-radius: var(--br-s, 8px);
                width: 26px;
                height: 26px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: var(--text-color-4, #888);
                transition: all 0.2s ease;
            }

            .add-toggle-btn svg {
                width: 12px;
                height: 12px;
                fill: currentColor;
            }

            .add-toggle-btn:hover {
                border-color: var(--primary, #ff6b00);
                color: var(--primary, #ff6b00);
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
                    <button class="add-block-btn" data-action="add" aria-label="Газар нэмэх">
                        <svg viewBox="0 0 448 512" aria-hidden="true">
                            <path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"/>
                        </svg>
                    </button>
                    <button class="add-label-btn" data-action="add">Газар нэмэх</button>
                    <button class="add-toggle-btn" data-action="toggle" aria-label="Нэмэх төрлийг солих">
                        <svg viewBox="0 0 512 512" aria-hidden="true">
                            <path fill="currentColor" d="M304 48c0-26.5 21.5-48 48-48l80 0c26.5 0 48 21.5 48 48l0 80c0 26.5-21.5 48-48 48-16.9 0-31.7-8.7-40.1-21.9l-82.7 82.7c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l82.7-82.7C312.7 79.7 304 64.9 304 48zM208 464c0 26.5-21.5 48-48 48l-80 0c-26.5 0-48-21.5-48-48l0-80c0-26.5 21.5-48 48-48 16.9 0 31.7 8.7 40.1 21.9l82.7-82.7c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-82.7 82.7c12.7 8.4 21.9 23.2 21.9 40.1l0 80z"/>
                        </svg>
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
     * 2. Товчны текстийг шинэчлэх функц үүсгэнэ
     * 3. Нэмэх төрөл солих event listener суулгана
     * 4. Газар/тэмдэглэл нэмэх event listener суулгана
     */
    attachEventListeners() {
        // Listener-ууд давхар суухаас сэргийлэх
        if (this._listenersAttached) return;
        this._listenersAttached = true;

        const shadow = this.shadowRoot;

        /**
         * updateLabel - Товчны текстийг шинэчлэх
         *
         * Үүрэг:
         * addType-ийн утгаас хамааруулан товчны текст болон aria-label-ийг шинэчилнэ
         */
        const updateLabel = () => {
            const labelBtn = shadow.querySelector('.add-label-btn');
            const addBtn = shadow.querySelector('.add-block-btn');
            const label = this.addType === 'note' ? 'Тэмдэглэл нэмэх' : 'Газар нэмэх';
            if (labelBtn) labelBtn.textContent = label;
            if (addBtn) addBtn.setAttribute('aria-label', label);
        };

        // Эхлээд текстийг тохируулах
        updateLabel();

        /**
         * Click event listener - Товч дарахад ажиллах
         *
         * Үүрэг:
         * 1. Дарагдсан товчийг олох
         * 2. toggle action бол addType-ийг солих
         * 3. add action бол add-item event дамжуулах
         */
        shadow.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('[data-action]');
            if (!actionBtn) return;

            const action = actionBtn.dataset.action;

            // Нэмэх төрөл солих
            if (action === 'toggle') {
                this.addType = this.addType === 'place' ? 'note' : 'place';
                updateLabel();
                return;
            }

            // Газар/тэмдэглэл нэмэх event дамжуулах
            this.dispatchEvent(new CustomEvent('add-item', {
                bubbles: true,
                composed: true,
                detail: { type: this.addType, divider: this }
            }));
        });
    }
}

// Компонентыг бүртгэх - <ag-travel-divider> тагийг ашиглах боломжтой болгоно
customElements.define('ag-travel-divider', AgTravelDivider);
