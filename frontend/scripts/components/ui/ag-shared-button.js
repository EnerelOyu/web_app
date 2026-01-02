class AgShareButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
    this.copied = false;
    this.sharedWith = [
      { id: 1, name: 'Бат', avatar: '/assets/images/guide-img/guide1.svg', color: '#FF6B00' },
      { id: 2, name: 'Сэргэлэн', avatar: '/assets/images/guide-img/guide2.svg', color: '#4A90E2' },
      { id: 3, name: 'Өлзий', avatar: '/assets/images/guide-img/guide3.svg', color: '#50C878' }
    ];
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./styles/global.css">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .share-container {
          position: absolute;
          right: var(--p-md);
          bottom: var(--p-md);
          z-index: 10;
        }

        .share-btn {
          background: none;
          border: none;
          padding: var(--p-xs);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
        }

        .share-btn:hover {
          transform: scale(1.2);
          opacity: 1;
        }

        .share-btn:active {
          transform: scale(0.95);
        }

        .share-icon {
          width: var(--svg-m);
          height: var(--svg-m);
          fill: var(--primary);
          stroke: var(--primary);
          transition: all 0.3s ease;
          display: block;
        }

        .share-btn:hover .share-icon {
          fill: var(--primary-1);
          stroke: var(--primary-1);
        }

        /* Modal overlay */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          display: none;
          align-items: center;
          justify-content: center;
          padding: var(--p-md);
          animation: fadeIn 0.2s ease;
        }

        .modal-overlay.show {
          display: flex;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Modal */
        .modal {
          background: var(--bg-color);
          border-radius: var(--br-m);
          box-shadow: 0 var(--share-modal-shadow-y, 20px) var(--share-modal-shadow-blur, 60px) rgba(0, 0, 0, 0.3);
          max-width: var(--share-modal-max-width, 28rem);
          width: 100%;
          padding: var(--p-lg);
          animation: scaleIn 0.2s ease;
        }

        /* Header */
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--m-lg);
        }

        .modal-title {
          font-size: var(--fs-xl);
          font-weight: bold;
          color: var(--text-color-0);
          font-family: 'Rubik', sans-serif;
        }

        .close-btn {
          background: none;
          border: none;
          padding: var(--p-xxs);
          cursor: pointer;
          color: var(--text-color-5);
          border-radius: var(--br-circle);
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: var(--text-color-8);
          color: var(--text-color-2);
        }

        .close-icon {
          width: var(--svg-s);
          height: var(--svg-s);
          stroke: currentColor;
          fill: none;
          stroke-width: var(--icon-stroke-width, 2);
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        /* Shared with section */
        .shared-section {
          margin-bottom: var(--m-lg);
        }

        .shared-title {
          font-size: var(--fs-sm);
          font-weight: 600;
          color: var(--text-color-2);
          margin-bottom: var(--m-sm);
          font-family: 'Rubik', sans-serif;
        }

        .shared-list {
          display: flex;
          flex-direction: column;
          gap: var(--gap-size-s);
        }

        .shared-person {
          display: flex;
          align-items: center;
          gap: var(--gap-size-s);
          padding: var(--p-xs);
          border-radius: var(--br-s);
          transition: background 0.2s;
        }

        .shared-person:hover {
          background: var(--primary-5);
        }

        .person-avatar {
          width: var(--share-avatar-size, 40px);
          height: var(--share-avatar-size, 40px);
          border-radius: var(--br-circle);
          object-fit: cover;
          border: var(--avatar-border-width, 2px) solid var(--text-color-7);
        }

        .person-name {
          font-weight: 500;
          color: var(--text-color-1);
          font-family: 'NunitoSans', sans-serif;
        }

        /* Share actions */
        .share-actions {
          display: flex;
          flex-direction: column;
          gap: var(--gap-size-s);
        }

        .action-btn {
          width: 100%;
          padding: var(--p-sm) var(--p-md);
          border: none;
          border-radius: var(--br-s);
          font-size: var(--fs-base);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--gap-size-s);
          transition: all 0.3s ease;
          font-family: 'Rubik', sans-serif;
        }

        .action-btn-primary {
          background: linear-gradient(to right, var(--primary), var(--primary-1));
          color: var(--bg-color);
          box-shadow: 0 var(--share-action-shadow-y, 4px) var(--share-action-shadow-blur, 12px) rgba(255, 107, 0, 0.3);
        }

        .action-btn-primary:hover {
          background: linear-gradient(to right, var(--primary-1), var(--primary-2));
          box-shadow: 0 var(--share-action-shadow-y-hover, 6px) var(--share-action-shadow-blur-hover, 16px) rgba(255, 107, 0, 0.4);
        }

        .action-btn-secondary {
          background: var(--text-color-8);
          color: var(--text-color-1);
        }

        .action-btn-secondary:hover {
          background: var(--text-color-7);
        }

        .btn-icon {
          width: var(--svg-s);
          height: var(--svg-s);
          fill: currentColor;
        }

        /* Info text */
        .info-text {
          font-size: var(--fs-xs);
          color: var(--text-color-4);
          text-align: center;
          margin-top: var(--m-md);
          font-family: 'NunitoSans', sans-serif;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .modal {
            padding: var(--p-md);
          }

          .modal-title {
            font-size: var(--fs-lg);
          }

          .share-btn {
            padding: var(--p-xs) var(--p-md);
            font-size: var(--fs-sm);
          }
        }
      </style>

      <div class="share-container">
        <button class="share-btn" id="shareBtn" title="Хуваалцах">
          <svg class="share-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m20 12l-6.4-7v3.5C10.4 8.5 4 10.6 4 19c0-1.167 1.92-3.5 9.6-3.5V19l6.4-7z"/>
          </svg>
        </button>

        <div class="modal-overlay" id="modalOverlay">
          <div class="modal">
            <div class="modal-header">
              <h2 class="modal-title">Хуваалцах</h2>
              <button class="close-btn" id="closeBtn">
                <svg class="close-icon" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div class="shared-section" id="sharedSection">
              <h3 class="shared-title">Хуваалцсан хүмүүс (<span id="sharedCount">0</span>)</h3>
              <div class="shared-list" id="sharedList"></div>
            </div>

            <div class="share-actions">
              <button class="action-btn action-btn-primary" id="mainShareBtn">
                <svg class="btn-icon" id="shareIcon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m20 12l-6.4-7v3.5C10.4 8.5 4 10.6 4 19c0-1.167 1.92-3.5 9.6-3.5V19l6.4-7z"/>
                </svg>
                <span id="shareText">Хуваалцах</span>
              </button>

              <button class="action-btn action-btn-secondary" id="copyBtn">
                <svg class="btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Холбоос хуулах</span>
              </button>
            </div>

            <p class="info-text">Төлөвлөгөөгөө найз нөхөдтэйгээ хуваалцаарай</p>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const shareBtn = this.shadowRoot.getElementById('shareBtn');
    const modalOverlay = this.shadowRoot.getElementById('modalOverlay');
    const closeBtn = this.shadowRoot.getElementById('closeBtn');
    const mainShareBtn = this.shadowRoot.getElementById('mainShareBtn');
    const copyBtn = this.shadowRoot.getElementById('copyBtn');

    shareBtn.addEventListener('click', () => this.openModal());
    closeBtn.addEventListener('click', () => this.closeModal());
    modalOverlay.addEventListener('click', (e) => {
      // Арын давхаргыг дарахад цонх хаах
      if (e.target === modalOverlay) {
        this.closeModal();
      }
    });

    mainShareBtn.addEventListener('click', () => this.handleShare());
    copyBtn.addEventListener('click', () => this.copyToClipboard());

    this.renderSharedList();
  }

  openModal() {
    const modalOverlay = this.shadowRoot.getElementById('modalOverlay');
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // Арын гүйлгэх үйлдлийг идэвхгүй болгох
  }

  closeModal() {
    const modalOverlay = this.shadowRoot.getElementById('modalOverlay');
    modalOverlay.classList.remove('show');
    document.body.style.overflow = ''; // Гүйлгэх үйлдлийг сэргээх
  }

  async handleShare() {
    const url = window.location.href;

    // Хөтөч хуваалцах функц дэмждэг эсэхийг шалгах
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Төлөвлөгөө',
          text: 'Миний аяллын төлөвлөгөө',
          url: url
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log('Share cancelled');
        }
      }
    } else {
      // Хөтөч дэмждэггүй бол холбоосыг хуулах
      await this.copyToClipboard();
    }
  }

  async copyToClipboard() {
    const url = window.location.href;
    const shareText = this.shadowRoot.getElementById('shareText');
    const shareIcon = this.shadowRoot.getElementById('shareIcon');

    try {
      await navigator.clipboard.writeText(url);

      // Амжилттай хуулсан мэдэгдэл харуулах
      shareText.textContent = 'Хуулагдлаа!';
      shareIcon.innerHTML = `
        <polyline points="20 6 9 17 4 12" stroke="currentColor" fill="none" stroke-width="2"></polyline>
      `;

      // 2 секундын дараа анхны төлөвт буцаах
      setTimeout(() => {
        shareText.textContent = 'Хуваалцах';
        shareIcon.innerHTML = `
          <path d="m20 12l-6.4-7v3.5C10.4 8.5 4 10.6 4 19c0-1.167 1.92-3.5 9.6-3.5V19l6.4-7z"/>
        `;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  renderSharedList() {
    const sharedList = this.shadowRoot.getElementById('sharedList');
    const sharedCount = this.shadowRoot.getElementById('sharedCount');
    const sharedSection = this.shadowRoot.getElementById('sharedSection');

    // Хуваалцсан хүн байхгүй бол секцийг нуух
    if (this.sharedWith.length === 0) {
      sharedSection.style.display = 'none';
      return;
    }

    sharedCount.textContent = this.sharedWith.length;

    // Хуваалцсан хүмүүсийн жагсаалт үүсгэх
    sharedList.innerHTML = this.sharedWith.map(person => `
      <div class="shared-person">
        <img class="person-avatar" src="${person.avatar}" alt="${person.name}">
        <span class="person-name">${person.name}</span>
      </div>
    `).join('');
  }
}

customElements.define('ag-share-button', AgShareButton);
