class AgReview extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        
    }


  render(){
    const br = this.getAttribute("bogin")||"null";
    const lr = this.getAttribute("urt")||"null";
    const rating = parseFloat(this.getAttribute("unelgee")) || "0.0";

    this.innerHTML=`
    <article class="review-card">
        <p class="brief-review">${br}</p>
        <p class="comment">${lr}</p>
        <ag-rating value="${rating}" color="var(--primary)"></ag-rating>
    </article>
    `;
  }

    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldVal, newVal) {
    }

    adoptedCallback() {
    }

}

window.customElements.define('ag-review', AgReview);