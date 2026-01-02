class AgGuideSection extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.initInstWidget();
        this.applyStyles();
    }

    applyStyles() {
        const styles = `
      .inst {
        grid-area: guide;
        justify-content: center;
        width: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
      }

      .inst h4, p {
        padding: 0;
      }

      .inst-select {
          display: flex;
          flex-direction: column;
          gap: var(--p-xs);
          transition: all var(--transition-medium);
      }

      .inst-select label {
          font-family: var(--font-body);
          font-size: var(--fs-sm);
          color: var(--text-color-2);
          font-weight: var(--fw-medium);
      }

      .inst-select select {
          padding: var(--p-sm);
          border-radius: var(--br-s);
          border: var(--border-width) solid var(--text-color-7);
          background: var(--bg-color);
          font-size: var(--fs-base);
          color: var(--text-color-1);
          transition: all var(--transition-medium);
          width: 100%;
      }

      .inst-select select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: var(--shadow-focus);
      }

      .inst-card {
          display: none;
          gap: var(--p-sm);
          padding: var(--p-md);
          align-items: flex-start;
          position: relative;
          animation: fadeIn var(--transition-medium);
      }

      .inst-card.show {
          display: flex;
      }

      .change-guide-btn {
          position: absolute;
          top: var(--p-xs);
          right: var(--p-xs);
          background: none;
          border: none;
          padding: var(--p-xs);
          border-radius: var(--br-s);
          cursor: pointer;
          color: var(--text-color-5);
          transition: all var(--transition-medium);
          opacity: 0;
      }

      .inst-card:hover .change-guide-btn {
          opacity: 1;
      }

      .change-guide-btn:hover {
          background: var(--text-color-8);
          color: var(--primary);
      }

      .change-guide-btn svg {
          width: var(--svg-s);
          height: var(--svg-s);
      }

      .inst-actions {
          position: absolute;
          display: flex;
          flex-direction: column;
          gap: var(--p-xs);
          bottom: var(--spacing-md);
          right: var(--spacing-md);
          z-index: var(--z-actions);
      }

      .inst-actions .inst-btn {
          min-width: var(--btn-min-width);
      }

      .inst-meta {
          margin: 0;
          font-size: var(--fs-xs);
          color: var(--text-color-3);
          line-height: var(--line-height-normal);
      }

      @keyframes fadeIn {
          from {
              opacity: 0;
              transform: translateY(var(--translate-fade-in));
          }
          to {
              opacity: 1;
              transform: translateY(0);
          }
      }

      .inst.has-guide .inst-select {
          opacity: 0;
          height: 0;
          overflow: hidden;
          margin: 0;
      }

      .inst.has-guide .inst-card {
          display: flex;
      }

      @media (max-width: 768px) {
          .inst-card {
              flex-direction: column;
              text-align: center;
              gap: var(--p-md);
          }

          .inst-card-left img {
              width: var(--avatar-size-mobile);
              height: var(--avatar-size-mobile);
              margin: 0 auto;
          }

          .change-guide-btn {
              opacity: 1;
          }
      }
        `;

        // Давхар нэмэхээс сэргийлэх - ID шалгах
        if (!document.querySelector('#guide-section-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'guide-section-styles';
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }
    }

    render() {
        this.innerHTML = `
            <div class="inst" aria-live="polite">
                <div class="inst-select" id="instSelect">
                    <label for="guideSelect">Хөтөч сонгох</label>
                    <select id="guideSelect" aria-label="Guide select">
                        <option value="">Сонгох</option>
                    </select>
                </div>

                <div class="inst-card" id="instCard" hidden>
                    <button class="change-guide-btn" id="changeGuideBtn" aria-label="Хөтөч солих">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                        </svg>
                    </button>
                    <ag-guide-card id="guideCardElement"></ag-guide-card>
                    <div class="inst-actions">
                        <button class="inst-btn primary" id="contactBtn" aria-label="Утасдах">Утасдах</button>
                        <button class="inst-btn secondary" id="profileBtn" aria-label="Профайл харах">Профайл харах</button>
                    </div>
                </div>
            </div>
        `;
    }

    initInstWidget() {
        const select = this.querySelector('#guideSelect');
        const card = this.querySelector('#instCard');
        const instContainer = this.querySelector('.inst');
        const changeGuideBtn = this.querySelector('#changeGuideBtn');
        const contactBtn = this.querySelector('#contactBtn');
        const profileBtn = this.querySelector('#profileBtn');
        const guideCardElement = this.querySelector('#guideCardElement');

        // Dropdown-д хөтчүүдийг нэмэх
        this.guides.forEach(guide => {
            const option = document.createElement('option');
            option.value = guide.id;
            option.textContent = `${guide.name} — ${guide.area.split(',')[0]}`;
            select.appendChild(option);
        });

        const showGuide = (guideId) => {
            const guide = this.guides.find(g => g.id === guideId);
            if (!guide) {
                this.hideGuide();
                return;
            }

            // ag-guide-card компонентод хөтчийн өгөгдөл дамжуулах
            if (guideCardElement && guideCardElement.setGuide) {
                guideCardElement.setGuide(guideId);
            }

            // Картыг харуулах, dropdown нуух
            card.hidden = false;
            card.classList.add('show');
            instContainer.classList.add('has-guide');

            // Сонгогдсон хөтчийг хадгалах
            instContainer.setAttribute('data-selected-guide', guideId);
        };

        this.hideGuide = () => {
            const instContainer = this.querySelector('.inst');
            const card = this.querySelector('#instCard');
            const select = this.querySelector('#instSelect');

            card.hidden = true;
            card.classList.remove('show');
            instContainer.classList.remove('has-guide');
            select.value = '';
            instContainer.removeAttribute('data-selected-guide');
        };

        select.addEventListener('change', () => {
            const guideId = select.value;
            if (guideId) {
                showGuide(guideId);
                // localStorage-д хадгалах
                localStorage.setItem('selectedGuide', guideId);
            } else {
                this.hideGuide();
                localStorage.removeItem('selectedGuide');
            }
        });

        changeGuideBtn.addEventListener('click', () => {
            this.hideGuide();
            localStorage.removeItem('selectedGuide');
            // Dropdown руу фокус шилжүүлэх
            setTimeout(() => {
                select.focus();
            }, 100);
        });

        contactBtn.addEventListener('click', () => {
            const selectedGuideId = instContainer.getAttribute('data-selected-guide');
            const guide = this.guides.find(g => g.id === selectedGuideId);
            if (!guide) {
                alert('Хөтөч сонгоно уу.');
                return;
            }
            // Утасны дугаар руу залгах
            window.location.href = `tel:${guide.phone.replace(/\s+/g, '')}`;
        });

        profileBtn.addEventListener('click', () => {
            const selectedGuideId = instContainer.getAttribute('data-selected-guide');
            const guide = this.guides.find(g => g.id === selectedGuideId);
            if (!guide) {
                alert('Хөтөч сонгоно уу.');
                return;
            }
            // Профайл хуудас руу шилжих (одоогоор жишээ)
            alert(`Орон нутгийн хөтөч ${guide.name} -ийн профайл руу шилжих (жишээ).`);
        });

        // localStorage-аас өмнө сонгосон хөтчийг ачаалах
        const savedGuide = localStorage.getItem('selectedGuide');
        if (savedGuide && this.guides.find(g => g.id === savedGuide)) {
            select.value = savedGuide;
            showGuide(savedGuide);
        }
    }
}

customElements.define('ag-guide-section', AgGuideSection);