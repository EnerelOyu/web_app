class AgFooter extends HTMLElement {
  constructor() {
    super();
    this.css = `
      @import url('./styles/global.css');
        @import url('/styles/fonts.css');

      footer{
        background-color: var(--ftr-bg-color);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        padding: var(--p-md) var(--p-xl);
        gap: var(--gap-size-xl);
      }

      .footer-left{
        display: flex;
        align-items: center;
        gap: var(--gap-size-m);
        text-decoration: none;
        cursor: pointer;
        transition: opacity 0.3s;
      }

      .footer-left:hover {
        opacity: 0.8;
      }

      .footer-logo{
        display: flex;
        flex-direction: column;
        justify-content:flex-start;
      }

      .footer-logo img{
        width: var(--logo-size);
        height: var(--logo-size);
      }

      .footer-left h1{
        color: var(--logo-text);
        padding-left: var(--p-sm);
        font-size: var(--fs-2xl);
        font-family: 'Rubik';
        margin: 0;
      }

      .footer-left span{
        color:var(--primary);
      }

      .footer-right{
        display: flex;
        flex-direction: row;
        gap: var(--gap-size-xl);
        margin-right: var(--m-md);
      }

      .footer-col{
        display: flex;
        flex-direction: column;
        gap: var(--gap-size-s);
      }

      .footer-col p{
        color: var(--text-color-9);
        font-family: 'NunitoSans';
        text-transform: uppercase;
        font-size: var(--fs-s);
        margin: 0;
      }

      .footer-list{
        margin: 0;
        padding: 0;
      }

      .footer-list li{
        text-decoration: none;
        color: var(--text-color-8);
        list-style: none;
        font-family: 'NunitoSans';
        padding: var(--p-xs) 0;
        font-size: var(--fs-xs);
      }

      .footer-list li:hover,
      .footer-list li a:hover{
        color: var(--primary);
      }

      .footer-list li a{
        text-decoration: none;
        color: var(--text-color-8);
      }

      .footer-social{
        display: flex;
        flex-direction: row;
        gap: var(--p-md);
        margin: var(--m-sm) 0 0;
        padding: 0;

      }

      .footer-social li{
        list-style: none;
      }


      .footer-social a{
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .footer-social svg{
        height: var(--svg-s);
        width: var(--svg-s);
        color: var(--text-color-9);
        fill: var(--text-color-9);
        transition: fill 0.3s, color 0.3s;
      }

      .footer-social svg:hover{
        fill: var(--primary);
        color: var(--primary);
      }

      .footer-bottom{
        width: 100%;
        margin-top: var(--m-md);
        text-align: center;
        font-size: var(--fs-xs);
        color: var(--text-color-8);
        font-family: 'NunitoSans';
        opacity: 0.8;
      }

      /* ====== MEDIA QUERIES ====== */

      /* Tablet */
      @media (max-width: 900px) {
        footer{
          flex-direction: column;
          align-items: flex-start;
          padding: var(--p-lg);
        }

        .footer-right{
          margin-right: 0;
        }
      }

      /* Mobile */
      @media (max-width: 600px) {
        footer{
          align-items: center;
          text-align: center;
        }

        .footer-left{
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .footer-left h1{
          padding-left: 0;
          font-size: var(--fs-xl);
        }

        .footer-right{
          flex-direction: column;
          align-items: center;
          gap: var(--gap-size-l);
          margin-right: 0;
        }

        .footer-col{
          align-items: center;
        }

        .footer-list li{
          text-align: center;
        }

        .footer-social{
          justify-content: center;
        }
      }
    `;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' }); // Shadow DOM үүсгэх
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${this.css}</style>
      <footer>
        <a href="#/home" class="footer-left">
          <div class="footer-logo">
            <img src="./assets/images/logo.svg" alt="AyalGO logo">
          </div>
          <h1>Ayal<span>GO</span></h1>
        </a>

        <div class="footer-right">
          <div class="footer-col">
            <p>Тусламж</p>
            <ul class="footer-list">
              <li><a href="#/spots">Аяллын цэг хайх</a></li>
              <li><a href="#/guide-signup">Хөтөчөөр бүртгүүлэх</a></li>
              <li><a href="#/plan">Аяллын төлөвлөгөө гаргах</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <p>Холбоо барих</p>
            <ul class="footer-list">
              <li>Утас: 1234-5678</li>
              <li>Email: company@email.com</li>
            </ul>
            <ul class="footer-social">
              <li>
                <a href="#" aria-label="Facebook">
                  <svg>
                    <use href="./styles/icons.svg#icon-facebook"></use>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" aria-label="Instagram">
                  <svg>
                    <use href="./styles/icons.svg#icon-instagram"></use>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

      </footer>
    `;
  }
}

window.customElements.define('ag-footer', AgFooter);
