class suggestedPoint  extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // const unelgee=this.getAttribute("rating") || "0.0";
        // const title = this.getAttribute("title") ||"Unknown";
        // const location = this.getAttribute("area") || "unknown";
        // const liked = this.getAttribute("like") || "false"
        this.innerHTML=`
            <article style="background-image: url(../files/12Landscape1.jpg);" class="TP">
                <div class="tp_ic">
                    <svg>
                        <use href="../styles/icons.svg#icon-star-filled"></use>
                        <use href="../styles/icons.svg#icon-star-filled"></use>
                        <use href="../styles/icons.svg#icon-star-filled"></use>
                        <use href="../styles/icons.svg#icon-star-filled"></use>
                        <use href="../styles/icons.svg#icon-star-filled"></use>
                    </svg>
                    <svg>
                        <use href="../styles/icons.svg#icon-add"></use>
                    </svg>
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
window.customElements.define('suggested-point', suggestedPoint);

class planPoint  extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // const unelgee=this.getAttribute("rating") || "0.0";
        // const title = this.getAttribute("title") ||"Unknown";
        // const location = this.getAttribute("area") || "unknown";
        // const liked = this.getAttribute("like") || "false"
        this.innerHTML=`<article style="background-image: url(../files/12Landscape1.jpg);" class="TP">
                    <div class="tp_ic">
                        <svg>
                            <use href="../styles/icons.svg#icon-star-filled"></use>
                            <use href="../styles/icons.svg#icon-star-filled"></use>
                            <use href="../styles/icons.svg#icon-star-filled"></use>
                            <use href="../styles/icons.svg#icon-star-filled"></use>
                            <use href="../styles/icons.svg#icon-star-filled"></use>
                        </svg>
                        <svg>
                            <use href="../styles/icons.svg#icon-add"></use>
                        </svg>
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
window.customElements.define('plan-point', planPoint);