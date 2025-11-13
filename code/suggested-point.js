class suggestedPoint  extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const unelgee=this.getAttribute("rating") || "0.0";
        const title = this.getAttribute("title") ||"Unknown";
        const location = this.getAttribute("area") || "unknown";
        const liked = this.getAttribute("like") || "false"
        this.innerHTML=`<article style="background-image: url(../files/12Landscape1.jpg);" class="TP">
                    <div class="tp_ic">
                        <div class="rating">
                            <svg data-value="1"><use href="../styles/icons.svg#icon-star-unfilled"></use></svg>
                            <svg data-value="2"><use href="../styles/icons.svg#icon-star-unfilled"></use></svg>
                            <svg data-value="3"><use href="../styles/icons.svg#icon-star-unfilled"></use></svg>
                            <svg data-value="4"><use href="../styles/icons.svg#icon-star-unfilled"></use></svg>
                            <svg data-value="5"><use href="../styles/icons.svg#icon-star-unfilled"></use></svg>
                        </div>
                        <svg>
                            <use href="../styles/icons.svg#icon-add"></use>
                        </svg>
                    </div>
                    <h3>Цэгийн нэр</h3>
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