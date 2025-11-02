class suggestedPoint  extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const unelgee=this.getAttribute("rating") || "0.0";
        const title = this.getAttribute("title") ||"Unknown";
        const location = this.getAttribute("area") || "unknown";
        const liked = this.getAttribute("like") || "false"
        this.innerHTML=`<article class="">
            <article class="TP">
                <img class="tp_bg" src="../files/12Landscape1.jpg" alt="">
                <div class="tp_ic">
                    <div>
                        <span class="star checked"></span>
                        <span class="star checked"></span>
                        <span class="star checked"></span>
                        <span class="star checked"></span>
                        <span class="star"></span>
                    </div>
                    <img class="icon" src="../files/add.svg" alt="">
                </div>
                <p>Цэгийн нэр</p>
                <p>Байршил</p>
            </article>
        `;
    }

    disconnectedCallback() {
        //implementation
    }

    attributeChangedCallback(name, oldVal, newVal) {
        //implementation
    }

    adoptedCallback() {
        //implementation
    }

}

window.customElements.define('plan', Plan);