class AgFooter extends HTMLElement {


    connectedCallback() {
        this.render();

    }
    render() {
        this.innerHTML = `
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