class AgTutorialCard extends HTMLElement {
    static get observedAttributes(){
        return["img", "short", "long"]
    }
    constructor() {
        super();
        this.css=`
        p{
        font-family: 'NunitoSans';
        }
        `;
        
    }

    connectedCallback() {
        this.render();
        
    }

    render(){
        const img = this.getAttribute("zrg") || "NULL";
        const short = this.getAttribute("bogin") || "NULL";
        const long = this.getAttribute("urt") || "NULL";
        
        this.innerHTML=`
        <style>${this.css}</style>
        <article class="tutorial-card">
          <img src="${img}" alt="tutorial-1">
          <h4>${short}</h4>
          <p>${long}</p>
        </article>
        `
    }

    disconnectedCallback() {
        
    }

    attributeChangedCallback(name, oldVal, newVal) {
        
    }

    adoptedCallback() {
        
    }

}

window.customElements.define('ag-tutorial-card', AgTutorialCard);