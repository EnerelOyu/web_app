class AgGuideBanner extends HTMLElement {
  static get observedAttributes() {
    return ["title", "subtitle", "href", "btn"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute("title") || "Хөтөч болж бүртгүүлэх";
    const subtitle =
      this.getAttribute("subtitle") || "Хөтөч болж өөрийн хувь нэмэрээ оруулах уу?";
    const href = this.getAttribute("href") || "guide_sign_up.html";
    const btnText = this.getAttribute("btn") || "Хөтөч болох";

    this.shadowRoot.innerHTML = `
      <style>
        @import url('./styles/global.css');
        @import url('./styles/fonts.css');

        :host {
          display: block;
          width: 100%;
        }

        .guide{
          background: var(--hdr-bg-color);
          width: 100%;
          display: grid;
          grid-template-columns: 2fr 1fr;
          align-items: center;
          padding: var(--p-2xl) 0;
          padding-left: var(--p-2xl);
      }

      .guide-inner{
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--gap-size-s);
          margin-left: var(--m-2xl);
      }

      .guide-inner h3{
          font-size: var(--fs-xl);
          font-family: 'Rubik';
          text-transform: uppercase;
      }

      .guide-inner h3, .guide-inner p{
          color: var(--primary);
      }

      .guide-inner p{
        font-family: 'NunitoSans';
        font-size: var(--fs-base);
      }


      .guide-btn{
          background-color: var(--primary);
          color: var(--text-color-0);
          border-radius: 9999px;
          padding: var(--p-md) var(--p-lg);
          text-transform: uppercase;
          font-family: 'Rubik';
          font-weight: bold;
          transition: all 0.3s;
          width: 50%;
          display: inline-flex;
          justify-content: center;
          align-items: center;
      }

      .guide-btn:link{
          text-decoration: none;
      }

      .guide-btn:hover{
          background-color: var(--primary-4);
          color: var(--primary);
      }

      @media (max-width: 768px){
          .guide{
              display: flex;
              flex-direction: column;
              gap: var(--gap-size-m);
              width: 100%;
              justify-content: center;
              align-items: center;
              padding: var(--p-xl) var(--p-md);
          }

          .guide-inner{
              align-items: center;
              text-align: center;
          }

          .guide-btn{
              width: 80%;
          }
      }
      @media (max-width: 480px){
        .guide{
          display: flex;
          flex-direction: column;
          gap: var(--gap-size-s);
          width: 100%;
          justify-content: center;
          align-items: center;
          padding: var(--p-xl) 0;
        }
        .guide-inner h3{
          margin-bottom: 0;
        }
        .guide-btn{
            width: 60%;
        }
      }
      </style>

      <section class="guide">
        <div class="guide-inner">
          <h3>${title}</h3>
          <p>${subtitle}</p>
        </div>
        <a class="guide-btn" href="${href}">${btnText}</a>
      </section>
    `;
  }
}

customElements.define("ag-guide-banner", AgGuideBanner);