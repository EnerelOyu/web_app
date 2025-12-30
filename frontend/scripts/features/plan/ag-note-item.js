class AgNoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['note-text', 'number'];
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
        // Make note item draggable
        this.setAttribute('draggable', 'true');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
            this.attachEventListeners();
        }
    }

    get noteText() {
        return this.getAttribute('note-text') || '';
    }

    get number() {
        return this.getAttribute('number') || '1';
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin: var(--m-md, 1rem) 0;
                }

                .note-container {
                    display: grid;
                    grid-template-columns: auto 1fr auto;
                    gap: var(--gap-size-m, 1rem);
                    padding: var(--p-lg, 1.5rem);
                    background: var(--bg-color, #fff);
                    border: 2px solid var(--text-color-8, #f0f0f0);
                    border-radius: var(--br-m, 12px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    transition: all 0.2s ease;
                    position: relative;
                }

                :host([draggable="true"]) .note-container {
                    cursor: grab;
                }

                :host([draggable="true"]) .note-container:active {
                    cursor: grabbing;
                }

                .note-container:hover {
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                    border-color: var(--primary-5, rgba(255, 107, 0, 0.2));
                }

                .note-number {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background: var(--primary-5, rgba(255, 107, 0, 0.1));
                    color: var(--primary, #ff6b00);
                    border-radius: var(--br-circle, 50%);
                    font-weight: 700;
                    font-size: var(--fs-lg, 1.125rem);
                    font-family: 'Rubik', sans-serif;
                    flex-shrink: 0;
                }

                .note-icon {
                    width: 20px;
                    height: 20px;
                    fill: currentColor;
                }

                .note-content {
                    display: flex;
                    flex-direction: column;
                    gap: var(--gap-size-xs, 0.5rem);
                }

                .note-header {
                    display: flex;
                    align-items: center;
                    gap: var(--gap-size-s, 0.75rem);
                }

                .note-title {
                    font-size: var(--fs-base, 1rem);
                    font-weight: 600;
                    color: var(--text-color-1, #333);
                    font-family: 'Rubik', sans-serif;
                    display: flex;
                    align-items: center;
                    gap: var(--gap-size-xs, 0.5rem);
                }

                .note-title svg {
                    width: 18px;
                    height: 18px;
                    fill: var(--text-color-3, #666);
                }

                .note-text {
                    color: var(--text-color-2, #555);
                    font-size: var(--fs-sm, 0.875rem);
                    line-height: 1.6;
                    font-family: 'NunitoSans', sans-serif;
                    white-space: pre-wrap;
                    word-break: break-word;
                    width: 100%;
                    border: 1px solid transparent;
                    padding: var(--p-xs, 0.5rem);
                    border-radius: var(--br-s, 8px);
                    background: transparent;
                    resize: vertical;
                    min-height: 60px;
                    transition: all 0.2s ease;
                }

                .note-text:hover {
                    border-color: var(--text-color-7, #ddd);
                    background: var(--text-color-9, #fafafa);
                }

                .note-text:focus {
                    outline: none;
                    border-color: var(--primary, #ff6b00);
                    background: var(--bg-color, #fff);
                    box-shadow: 0 0 0 3px var(--primary-5, rgba(255, 107, 0, 0.1));
                }

                .note-actions {
                    display: flex;
                    gap: var(--gap-size-xs, 0.5rem);
                    align-items: flex-start;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s ease;
                }

                .note-container:hover .note-actions {
                    opacity: 1;
                    pointer-events: auto;
                }

                .action-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: var(--p-xs, 0.5rem);
                    border-radius: var(--br-s, 8px);
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-color-3, #666);
                }

                .action-btn.drag {
                    cursor: grab;
                }

                .action-btn.drag:active {
                    cursor: grabbing;
                }

                .action-btn:hover {
                    background: var(--text-color-8, #f5f5f5);
                    color: var(--text-color-1, #333);
                }

                .action-btn.delete:hover {
                    background: #fee;
                    color: #d00;
                }

                .action-btn svg {
                    width: 18px;
                    height: 18px;
                    fill: currentColor;
                }

                /* Dragging state */
                :host(.dragging) .note-container {
                    opacity: 0.5;
                    transform: scale(0.98);
                }

                @media (max-width: 768px) {
                    .note-container {
                        grid-template-columns: auto 1fr;
                        padding: var(--p-md, 1rem);
                    }

                    .note-actions {
                        grid-column: 2 / 3;
                        justify-content: flex-end;
                        margin-top: var(--m-xs, 0.5rem);
                        opacity: 1;
                        pointer-events: auto;
                    }

                    .note-number {
                        width: 32px;
                        height: 32px;
                        font-size: var(--fs-base, 1rem);
                    }
                }
            </style>

            <div class="note-container">
                <div class="note-number">
                    <svg viewBox="0 0 448 512" class="note-icon">
                        <path fill="currentColor" d="M64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 213.5c0 17-6.7 33.3-18.7 45.3L322.7 461.3c-12 12-28.3 18.7-45.3 18.7L64 480z"/>
                    </svg>
                </div>
                <div class="note-content">
                    <div class="note-header">
                        <h3 class="note-title">
                            Тэмдэглэл #${this.number}
                        </h3>
                    </div>
                    <textarea class="note-text" placeholder="Тэмдэглэл бичих...">${this.noteText}</textarea>
                </div>
                <div class="note-actions">
                    <button class="action-btn drag" title="Зөөх" aria-label="Зөөх">
                        <svg viewBox="0 0 320 512" aria-hidden="true">
                            <path fill="currentColor" d="M96 0C78.3 0 64 14.3 64 32l0 64c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32L96 0zM96 192c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-32 0zM64 416c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32l0 64zM224 0c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-32 0zM192 224c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32l0 64zM224 384c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-32 0z"/>
                        </svg>
                    </button>
                    <button class="action-btn edit" title="Засах" aria-label="Засах">
                        <svg viewBox="0 0 512 512" aria-hidden="true">
                            <path fill="currentColor" d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/>
                        </svg>
                    </button>
                    <button class="action-btn delete" title="Устгах" aria-label="Устгах">
                        <svg viewBox="0 0 448 512" aria-hidden="true">
                            <path fill="currentColor" d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const shadow = this.shadowRoot;

        // Textarea auto-resize and save
        const textarea = shadow.querySelector('.note-text');
        if (textarea) {
            // Auto-resize function
            const autoResize = () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            };

            // Initial resize
            autoResize();

            // Resize on input
            textarea.addEventListener('input', autoResize);

            // Save on blur
            textarea.addEventListener('blur', () => {
                const newText = textarea.value.trim();
                if (newText) {
                    this.setAttribute('note-text', newText);
                }
            });
        }

        // Edit button - focus textarea
        const editBtn = shadow.querySelector('.edit');
        editBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (textarea) {
                textarea.focus();
                textarea.select();
            }
        });

        // Delete button
        const deleteBtn = shadow.querySelector('.delete');
        deleteBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent('delete-note', {
                bubbles: true,
                composed: true,
                detail: { item: this }
            }));
            this.remove();
        });
    }
}

customElements.define('ag-note-item', AgNoteItem);
