// Home хуудсын хайлтын компонент - Бүс нутаг болон категориор хайх
class AgHomeSearch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const areaLabel = this.getAttribute("area-label") || "Бүс нутаг";
    const cateLabel = this.getAttribute("cate-label") || "Категори";

    // Бүс нутаг болон категорийн жагсаалтыг attribute-аас авах
    const areas = JSON.parse(this.getAttribute("areas") || "[]");
    const categories = JSON.parse(this.getAttribute("categories") || "[]");

    this.shadowRoot.innerHTML = `
      <style>
        @import url('./styles/global.css');
        @import url('./styles/fonts.css');

        :host {
          display: block;
          width: 100%;
        }

        .search-form {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          border-radius: 9999px;
          background-color: var(--accent-7);
          padding: var(--p-sm) var(--p-lg);
          gap: var(--gap-size-m);
          width: 70%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          animation: scaleIn 0.8s ease-out 0.4s backwards;
          margin: 0 auto;
        }

        /* Хайлтын формын дэлгэцэнд орох animation */
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Hover үед form хөргөх эффект */
        .search-form:hover {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          transform: translateY(-3px);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--gap-size-s);
          justify-content: flex-start;
          flex: 1;
          min-width: 0;
          margin-left: var(--m-sm)
        }

        .form-group label {
          font-family: 'Rubik';
          font-size: var(--fs-base);
          font-weight: 600;
          color: var(--text-color-2);
          transition: color 0.2s ease;
        }

        .form-group:focus-within label {
          color: var(--accent);
        }

        .form-group select {
          font-size: var(--fs-base);
          color: var(--text-color-3);
          outline: none;
          border: none;
          background-color: var(--accent-7);
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0.85;
          padding: var(--p-xs) 0;
          font-family: 'NunitoSans';
        }

        .form-group select:hover,
        .form-group select:focus {
          opacity: 1;
          color: var(--text-color-1);
        }

        #filter-submit {
          background-color: var(--accent);
          display: inline-flex;
          justify-content: center;
          align-items: center;
          border-style: none;
          border-radius: 50%;
          height: var(--svg-l);
          width: var(--svg-l);
          min-width: var(--svg-l);
          transition: all 0.3s ease;
          cursor: pointer;
          overflow: hidden;
        }

        #filter-submit:hover {
          transform: scale(1.08);
          background-color: var(--accent-7);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }

        #filter-submit svg {
          height: var(--svg-m);
          width: var(--svg-m);
          color: var(--accent-9);
          transition: all 0.3s ease;
          z-index: 1;
        }

        #filter-submit:hover svg {
          color: var(--accent);
          transform: rotate(90deg);
        }

        #filter-submit:active {
          transform: scale(0.95);
        }

        /* MEDIA QUERY */

        *:focus-visible {
          outline: 2px solid var(--accent-3);
          outline-offset: 2px;
        }


        /* Tablet - 1024px-ээс бага */
        @media (max-width: 1024px) {
          .search-form {
            width: 90%;
            padding: var(--p-sm) var(--p-md);
          }
        }

        /* Mobile landscape - 768px-ээс бага */
        @media (max-width: 768px) {
          .search-form {
            flex-direction: column;
            width: 90%;
            border-radius: var(--br-m);
            padding: var(--p-md);
            gap: var(--gap-size-s);
            transform: none;
          }

          .form-group {
            width: 100%;
          }

          #filter-submit {
            height: var(--svg-l);
            border-radius: var(--br-m);
          }
        }

        /* Mobile portrait - 480px-ээс бага */
        @media (max-width: 480px) {
          .search-form {
            gap: var(--gap-size-s);
          }
        }
      </style>

      <form class="search-form" id="search-form" novalidate>
        <div class="form-group">
          <label for="areas">${areaLabel}</label>
          <select id="areas">
            <option value="" disabled selected>Сонгоно уу</option>
            ${areas.map(a => `<option value="${a}">${a}</option>`).join("")}
          </select>
        </div>

        <div class="form-group">
          <label for="categories">${cateLabel}</label>
          <select id="categories">
            <option value="" disabled selected>Сонгоно уу</option>
            ${categories.map(c => `<option value="${c}">${c}</option>`).join("")}
          </select>
        </div>

        <button id="filter-submit" type="submit" aria-label="Хайх">
          <svg><use href="./styles/icons.svg#icon-search"></use></svg>
        </button>
      </form>
    `;

    // Form элементүүдийг олох
    const form = this.shadowRoot.getElementById("search-form");
    const areaSelect = this.shadowRoot.getElementById("areas");
    const categorySelect = this.shadowRoot.getElementById("categories");

    if (!form) return;

    // Form submit үед хайлтын параметрүүдийг /spots хуудас руу илгээх
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      // Сонгогдсон утгуудыг авах
      const area = areaSelect.value;
      const category = categorySelect.value;

      // URL параметрүүд үүсгэх
      const params = new URLSearchParams();

      if (area) params.set("bus", area);
      if (category) params.set("cate", category);

      const query = params.toString();

      // Hash-based routing ашиглан /spots хуудас руу шилжих
      if (query) {
        window.location.hash = `#/spots?${query}`;
      } else {
        window.location.hash = '#/spots';
      }
    });
  }
}

customElements.define("ag-home-search", AgHomeSearch);
