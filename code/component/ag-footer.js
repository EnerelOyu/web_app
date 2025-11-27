class AgFooter extends HTMLElement {
  constructor(){
    super();
    this.css=`
    footer{
    background-color: var(--ftr-bg-color);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: var(--p-md) var(--p-sm);
    }

    .footer-left{
        display: flex;
        align-items: center;
        gap: var(--gap-size-m);
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

    .footer-logo p{
        color:var(--primary);
        font-size: var(--fs-xs);
        padding: var(--p-md);
        font-weight: bold ;
        font-family: 'Rubik';
    }


    .footer-left h1{
        color: var(--bg-color);
        padding-left: var(--p-sm);
        font-size: var(--fs-2xl);
        font-family: 'Rubik';
    }

    .footer-left span{
        color:var(--primary);
    }

    .footer-right{
        display: flex;
        gap: var(--gap-size-m);
        margin-right: var(--m-md);
    }

    .footer-col{
        display: flex;
        flex-direction: column;
        gap: var(--gap-size-s);
    }
    .footer-col p{
        color: var(--primary-5);
        font-family: 'NunitoSans';
        text-transform: uppercase;
        font-size: var(--fs-s);
    }

    .footer-list{
        margin: 0;
        padding: 0;
    }

    .footer-list li{
        text-decoration: none;
        color: var(--primary-5);
        list-style: none;
        font-family: 'NunitoSans';
        padding: var(--p-xs) 0;
        font-size: var(--fs-xs);
    }

    .footer-list li:hover, .footer-list li a:hover{
        color: var(--primary);
    }

    .footer-list li a{
        text-decoration: none;
        color: var(--primary-5);
    }

    .footer-social{
        display: flex;
        flex-direction: row;
        gap: var(--p-md);
        margin: 0;
        padding: 0;
    }

    .footer-social svg{
        height: var(--svg-s);
        width: var(--svg-s);
        fill: var(--primary-5);
    }

    .footer-social svg:hover{
        fill: var(--primary);
    }
    `
  }


    connectedCallback() {
        this.render();

    }
    render() {
        this.innerHTML = `
        <style>${this.css}</style>
        <footer>
            <div class="footer-left">
              <div class="footer-logo">
                <img src="../files/logo.svg" alt="AyalGo logo">
                <p>Discover Mongolia <br>your way</p>
              </div>
              <h1>Ayal<span>GO</span></h1>
            </div>
            <div class="footer-right">
              <div class="footer-col">
                <p>Тусламж</p>
                <ul class="footer-list">
                  <li><a href="">Аяллын цэг хайх</a></li>
                  <li><a href="../code/guide_sign_up.html">Хөтөчөөр бүртгүүлэх</a></li>
                  <li><a href=""></a>Аяллын төлөвлөгөө яаж гаргах вэ</li>
                </ul>
              </div>
              <div class="footer-col">
                <p>Холбоо барих</p>
                <ul class="footer-list">
                  <li>Утас: 1234567890</li>
                  <li>Email: company@email.com</li>
                  <ul class="footer-social">
                    <li>
                      <svg>
                        <use href="../styles/icons.svg#icon-facebook"></use>
                      </svg>
                    </li>
                    <li>
                      <svg>
                        <use href="../styles/icons.svg#icon-instagram"></use>
                      </svg>
                    </li>
                  </ul>
                </ul>
              </div>
            </div>
        </footer>
        `;
    }

}

window.customElements.define('ag-footer', AgFooter);