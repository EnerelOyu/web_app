// Components are already loaded in index.html, no need to import again
// but we keep imports for module dependencies

class PageGuideSignup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.onSubmit = this.onSubmit.bind(this);
  }

  connectedCallback() {
    this.render();

    this.$img = this.shadowRoot.querySelector("ag-image-upload");
    this.$basic = this.shadowRoot.querySelector("ag-guide-basic-form");
    this.$prefs = this.shadowRoot.querySelector("ag-guide-preferences");
    this.$btn = this.shadowRoot.querySelector(".submit-btn");

    this.$btn.addEventListener("click", this.onSubmit);
  }

  disconnectedCallback() {
    this.$btn?.removeEventListener("click", this.onSubmit);
  }

  onSubmit() {
    const payload = {
      imageFile: this.$img?.getFile?.() ?? null,
      basic: this.$basic?.getValue?.() ?? {},
      preferences: this.$prefs?.getValue?.() ?? {},
      createdAt: new Date().toISOString(),
    };

    if (!payload.basic?.firstName || !payload.basic?.lastName) {
      alert("Овог, нэрээ бөглөнө үү.");
      return;
    }
    if (!payload.basic?.email) {
      alert("Цахим шуудан бөглөнө үү.");
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('lastName', payload.basic.lastName);
    formData.append('firstName', payload.basic.firstName);
    formData.append('phone', payload.basic.phone || '');
    formData.append('email', payload.basic.email);
    formData.append('area', payload.preferences.region !== 'default' ? payload.preferences.region : '');
    formData.append('category', payload.preferences.category !== 'default' ? payload.preferences.category : '');
    formData.append('languages', payload.preferences.language !== 'default' ? payload.preferences.language : '');
    formData.append('experienceLevel', payload.preferences.experience !== 'default' ? payload.preferences.experience : '');
    if (payload.imageFile) {
      formData.append('profileImage', payload.imageFile);
    }

    // Send to backend
    fetch('http://localhost:3000/api/guides', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        alert(`Хөтөч амжилттай бүртгэгдлээ! ID: ${data.guideId}`);
        // Refresh guide data
        if (window.appState && window.appState.loadGuideData) {
          window.appState.loadGuideData();
        }
        // Redirect to guides page to see all guides including the new one
        window.location.hash = '#/guides';
      } else {
        alert('Алдаа гарлаа: ' + data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Сүлжээний алдаа гарлаа.');
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('/styles/fonts.css');
        @import url('./styles/global.css');

        /* ===== guide_sign_up.css (page-level) ===== */
        :host {
          display: block;
        }

        main{
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--gap-size-m);
          margin: var(--m-md);
          min-height: 70vh;
          position: relative;
        }

        .container{
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: var(--gap-size-2xl);
          align-items: start;
          width: 100%;
        }

        h1{
          text-transform: uppercase;
          font-family: 'Rubik';
          color: var(--text-color-1);
        }

        .submit-btn{
          background-color: var(--primary);
          color: var(--primary-5);
          text-transform: uppercase;
          font-size: var(--fs-xs);
          font-family: 'NunitoSans';
          font-weight: 600;
          border-radius: var(--br-m);
          border: none;
          padding: var(--p-xs) var(--p-md);
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          letter-spacing: 0.5px;
          position: absolute;
          right: var(--m-lg);
          bottom: var(--m-lg);
        }

        .submit-btn:hover{
          background-color: var(--secondary);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .submit-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* ===== Responsive ===== */
        @media (max-width: 1024px) {
          .container{
            grid-template-columns: 1fr 1fr;
            gap: var(--gap-size-xl);
          }
          main{ margin: var(--m-sm); }
        }

        @media (max-width: 768px) {
          .container{
            grid-template-columns: 1fr;
            gap: var(--gap-size-l);
          }
          main{ margin: var(--m-xs); }

          h1{
            font-size: var(--fs-lg);
            text-align: center;
          }

          .submit-btn{
            position: static;
            width: 100%;
            margin-top: var(--m-lg);
          }
        }

        @media (max-width: 480px) {
          main{ gap: var(--gap-size-s); }
        }
      </style>

      <main>
        <h1>Хөтөч болох бүртгэл</h1>
        <div class="container">
          <ag-image-upload icon-path="./styles/icons.svg"></ag-image-upload>
          <ag-guide-basic-form></ag-guide-basic-form>
          <ag-guide-preferences></ag-guide-preferences>
          <button class="submit-btn">Бүртгүүлэх</button>
        </div>
      </main>
    `;
  }
}

customElements.define("ag-page-guide-signup", PageGuideSignup);
export default PageGuideSignup;
