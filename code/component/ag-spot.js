class AgSpot extends HTMLElement {
    static get observedAttributes(){
        return["img", "name", "area","link"]
    }
    constructor() {
        super();
        
    }

    connectedCallback() {
        this.render();
        
    }

    disconnectedCallback() {
        
    }

    attributeChangedCallback() {
        this.render();
        
    }

    render(){
        const img = this.getAttribute("zrg") || "../files/spot_img_eg.jpg";
        const name = this.getAttribute("ner") || "Unknown";
        const area = this.getAttribute("bus") || "Unknown";
        const link = this.getAttribute("zam") || "../code/aylaliin_tsegiin_medeelel.html";

        this.innerHTML =   `
        <article class="spot-card">
          <figure class="spot-img">
            <img src="${img}" alt="${name}">
            <button>
              <svg>
                <use href="../styles/icons.svg#icon-add"></use>
              </svg>
            </button>
          </figure>
          <p class="spot-area">${area}</p>
          <h4 class="spot-name">${name}</h4>
          <div class="line"></div>
          <a href="${link}" class="spot-detail">
            <p>ДЭЛЭГРЭНГҮЙ</p>
            <svg class="more-icon">
              <use href="../styles/icons.svg#icon-arrow"></use>
            </svg>
          </a>
        </article>
        `
    }

    adoptedCallback() {
        
    }

}

window.customElements.define('ag-spot', AgSpot);