// Components are already loaded in index.html, no need to import again
// but we keep imports for module dependencies

class PageGuideSignup extends HTMLElement {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  connectedCallback() {
    this.render();

    this.$img = this.querySelector("ag-image-upload");
    this.$basic = this.querySelector("ag-guide-basic-form");
    this.$prefs = this.querySelector("ag-guide-preferences");
    this.$btn = this.querySelector(".submit-btn");

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

    // Map to database fields
    const guideData = {
      lastName: payload.basic.lastName,
      firstName: payload.basic.firstName,
      phone: payload.basic.phone || null,
      email: payload.basic.email,
      area: payload.preferences.region !== 'default' ? payload.preferences.region : null,
      category: payload.preferences.category !== 'default' ? payload.preferences.category : null,
      languages: payload.preferences.language !== 'default' ? payload.preferences.language : null,
      experienceLevel: payload.preferences.experience !== 'default' ? payload.preferences.experience : null,
      profileImgUrl: null // TODO: handle image upload
    };

    // Send to backend
    fetch('http://localhost:3000/api/guides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(guideData)
    })
    .then(response => response.json())
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
    this.innerHTML = `
      <style>
        /* ===== guide_sign_up.css (page-level) ===== */
        page-guide-signup {
          display: block;
        }

        page-guide-signup main{
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--gap-size-m);
          margin: var(--m-md);
          min-height: 70vh;
          position: relative;
        }

        page-guide-signup .container{
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: var(--gap-size-2xl);
          align-items: start;
          width: 100%;
        }

        page-guide-signup h1{
          text-transform: uppercase;
          font-family: 'Rubik';
          color: var(--text-color-1);
        }

        page-guide-signup .submit-btn{
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

        page-guide-signup .submit-btn:hover{
          background-color: var(--secondary);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        page-guide-signup .submit-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* ===== Responsive ===== */
        @media (max-width: 1024px) {
          page-guide-signup .container{
            grid-template-columns: 1fr 1fr;
            gap: var(--gap-size-xl);
          }
          page-guide-signup main{ margin: var(--m-sm); }
        }

        @media (max-width: 768px) {
          page-guide-signup .container{
            grid-template-columns: 1fr;
            gap: var(--gap-size-l);
          }
          page-guide-signup main{ margin: var(--m-xs); }

          page-guide-signup h1{
            font-size: var(--fs-lg);
            text-align: center;
          }

          page-guide-signup .submit-btn{
            position: static;
            width: 100%;
            margin-top: var(--m-lg);
          }
        }

        @media (max-width: 480px) {
          page-guide-signup main{ gap: var(--gap-size-s); }
        }
      </style>

      <main>
        <h1>Хөтөч болох бүртгэл</h1>
        <div class="container">
          <ag-image-upload icon-path="../styles/icons.svg"></ag-image-upload>
          <ag-guide-basic-form></ag-guide-basic-form>
          <ag-guide-preferences></ag-guide-preferences>
          <button class="submit-btn">Бүртгүүлэх</button>
        </div>
      </main>
    `;
  }
}

customElements.define("page-guide-signup", PageGuideSignup);
export default PageGuideSignup;
