class AgToast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  show(message, type = 'success', duration = 3000) {
    const toast = this.shadowRoot.querySelector('.toast');
    const messageEl = this.shadowRoot.querySelector('.toast-message');

    messageEl.textContent = message;
    toast.className = `toast toast-${type} show`;

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('./styles/global.css');
        @import url('/styles/fonts.css');

        .toast {
          position: fixed;
          top: 100px;
          right: 50px;
          padding: var(--p-md) var(--p-lg);
          border-radius: var(--br-m);
          background-color: var(--accent-7);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: var(--gap-size-m);
          transform: translateX(450px);
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 9999;
          border-left: 4px solid;
        }

        .toast.show {
          transform: translateX(0);
          opacity: 1;
        }

        .toast-success {
          border-color: var(--success);
        }

        .toast-error {
          border-color: var(--error);
        }

        .toast-info {
          border-color: var(--primary);
        }

        .toast-icon {
          width: var(--svg-m);
          height: var(--svg-m);
          color: var(--accent-1);
          fill: var(--accent-1);
          flex-shrink: 0;
        }

        .toast-success .toast-icon {
          color: var(--success);
        }

        .toast-error .toast-icon {
          color: var(--error);
        }

        .toast-info .toast-icon {
          color: var(--primary);
        }

        .toast-message {
          font-family: 'NunitoSans';
          font-size: var(--fs-sm);
          color: var(--accent-1);
          flex: 1;
          margin: 0;
        }

        @media (max-width: 768px) {
          .toast {
            right: 10px;
            left: 10px;
            min-width: auto;
            top: 80px;
          }
        }
      </style>

      <div class="toast">
        <svg class="toast-icon" aria-hidden="true" focusable="false">
          <use href="./styles/icons.svg#icon-added"></use>
        </svg>
        <p class="toast-message"></p>
      </div>
    `;
  }
}

customElements.define('ag-toast', AgToast);
