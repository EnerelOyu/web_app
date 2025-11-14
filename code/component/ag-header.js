class AgHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    this.markActiveLink();
  }

  render() {
    this.innerHTML = `
      <header>
        <div class="logo">
          <img src="../files/logo.svg" alt="Logo">
          <h1>Ayal<span>GO</span></h1>
          <p>Discover Mongolia <br>your way</p>
        </div>
        <div class="header-nav">
          <a href="home.html">Нүүр Хуудас</a>
          <a href="spots.html">Аяллын Цэгүүд</a>
          <a href="plan.html">Миний Төлөвлөгөө</a>
          <input type="text" placeholder="Хайлт хийх..">
          <button class="search-btn">
            <svg>
              <use href="../styles/icons.svg#icon-search"></use>
            </svg>
          </button>
        </div>
      </header>
    `;
  }

  markActiveLink() {
    let currentPath = window.location.pathname.split("/").pop();
    if (!currentPath) {
      currentPath = "home.html"; 
    }

    const links = this.querySelectorAll(".header-nav a[href]");
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentPath) {
        link.setAttribute("aria-current", "page");
        link.classList.add("is-active");
      }
    });
  }
}

customElements.define("ag-header", AgHeader);
