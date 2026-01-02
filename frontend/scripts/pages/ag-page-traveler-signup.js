class PageTravelerSignup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();

    // Social login buttons
    this.$googleBtn = this.shadowRoot.querySelector(".social-btn.google");
    this.$facebookBtn = this.shadowRoot.querySelector(".social-btn.facebook");
    this.$googleBtn.addEventListener("click", this.onGoogleLogin.bind(this));
    this.$facebookBtn.addEventListener("click", this.onFacebookLogin.bind(this));
  }

  disconnectedCallback() {
    this.$googleBtn?.removeEventListener("click", this.onGoogleLogin);
    this.$facebookBtn?.removeEventListener("click", this.onFacebookLogin);
  }

  onGoogleLogin() {
    alert("Google-р нэвтрэх үйлдэл хөгжүүлэгдэж байна.");
  }

  onFacebookLogin() {
    alert("Facebook-р нэвтрэх үйлдэл хөгжүүлэгдэж байна.");
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('./styles/global.css');
        @import url('./styles/fonts.css');

        .signup-container {
          max-width: 500px;
          margin: 0 auto;
          padding: var(--p-lg);
          background: var(--bg-color);
          border-radius: var(--br-lg);
          box-shadow: 0 4px 20px color-mix(in srgb, var(--text-color-0) 10%, transparent);
          text-align: center;
        }

        .signup-header {
          margin-bottom: var(--m-lg);
        }

        .signup-header h1 {
          color: var(--primary);
          margin-bottom: var(--m-sm);
        }

        .signup-header p {
          color: var(--text-color-2);
          font-size: var(--fs-sm);
          margin-bottom: var(--m-lg);
        }

        .social-login-title {
          color: var(--text-color-1);
          font-size: var(--fs-sm);
          margin-bottom: var(--m-md);
          position: relative;
        }
        .social-buttons {
          display: flex;
          gap: var(--gap-size-md);
          margin-bottom: var(--m-lg);
        }

        .social-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--gap-size-sm);
          padding: var(--p-md);
          border: 1px solid var(--border-color);
          border-radius: var(--br-m);
          background-color: var(--bg-color);
          color: var(--text-color-1);
          text-decoration: none;
          font-family: 'NunitoSans';
          font-size: var(--fs-sm);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: var(--m-sm);
        }

        .social-btn.google {
          background-color: var(--primary);
          color: white;
        }

        .social-btn.facebook {
          background-color: var(--text-color-4);
          color: white;
        }

        .social-btn svg {
          width: 20px;
          height: 20px;
        }

        .form-note {
          color: var(--text-color-2);
          font-size: var(--fs-sm);
          font-style: italic;
        }

        .guide-signup-link {
          display: block;
          margin-top: var(--m-md);
          color: var(--primary);
          text-decoration: none;
          font-size: var(--fs-sm);
          transition: color 0.3s;
        }

        .guide-signup-link:hover {
          color: var(--primary-hover);
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .social-buttons {
            flex-direction: column;
          }
        }
      </style>

      <div class="signup-container">
        <div class="signup-header">
          <h1>Аялагч Нэвтрэх</h1>
        </div>
        <div class="social-login-title">Social account-аар нэвтрэх</div>
        <div class="social-buttons">
          <button class="social-btn google" type="button">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google-р нэвтрэх
          </button>
          <button class="social-btn facebook" type="button">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook-р нэвтрэх
          </button>
        </div>
        <a href="#/guide-signup" class="guide-signup-link">Хөтөчөөр бүртгүүлэх</a>
      </div>
    `;
  }
}

customElements.define("ag-page-traveler-signup", PageTravelerSignup);
