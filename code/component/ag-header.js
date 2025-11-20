class AgHeader extends HTMLElement {
  constructor() {
        super();
        this.css=`
        @import url('fonts.css');

        header{
            position: sticky;
            z-index: 1000; 
            padding: var(--p-md) var(--p-sm);
            background-color: var(--hdr-bg-color);
            display: flex;
            align-items:center;
        }

        .logo{
            display: inline-flex;
            margin-right: auto;
            align-items: center;
            justify-content: center;
        }

        .logo img{
            width: var(--logo-size);
            height: var(--logo-size);
        }

        .logo>h1{
            color: var(--bg-color);
            padding-left: var(--p-sm);
            font-size: var(--fs-2xl);
            font-family: 'Rubik';
        }

        .logo>h1>span{
            color:var(--primary);
        }

        .logo>p{
            color:var(--primary);
            font-size: var(--fs-xs);
            padding: var(--p-md);
            font-weight: bold ;
            font-family: 'Rubik';
        }

        .header-nav{
            display: flex;
            gap: var(--gap-size-s);
            align-items: center;
        }

        .header-nav>a:link{
            text-decoration: none;
        }

        .header-nav a{
            color:var(--primary-4);
            font-size: var(--fs-xs);
            font-family: 'NunitoSans';
            text-transform: uppercase;
        }

        .header-nav a:hover{
            color: var(--primary);
        }

        .search-btn{
            display: inline-flex;
            background-color: var(--primary-4);
            border-radius: var(--br-circle);
            border-style: none;
            align-items: center;
            justify-content: center;
            height: var(--svg-m);
            width: var(--svg-m);
            transition: background-color 0.3s;
        }

        .search-btn svg{
            height: var(--svg-s);
            width: var(--svg-s);
            color: var(--primary);
            transition: 0.3s;
        }

        .search-btn:hover{
            background-color: var(--primary);
        }

        .search-btn:hover svg{
            color: var(--primary-4);
        }

        .header-nav input{
            background-color: var(--primary-4);
            border-radius: 9999px;
            border-style: none;
            height: var(--svg-m);
            padding-left: var(--p-md);

        }

        .header-nav input::placeholder{
            color: var(--text-color-2);
            font-family: 'NunitoSans';
        }

        .header-nav a.is-active {
            color: var(--primary);
            font-weight: 700;
        }

        `
    }
  connectedCallback() {
    this.render();
    this.markActiveLink();
  }

  render() {
    this.innerHTML =`
    <style>${this.css}</style>
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
