class SpotCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const unelgee=this.getAttribute("rating") || "0.0";
        const title = this.getAttribute("title") ||"Unknown";
        const bus = this.getAttribute("area") || "unknown";
        const une = this.getAttribute("price") || "0"
        this.innerHTML=`<article class="spot-card">
                <div class="spot-img">
                    <a target="_blank" href="aylaliin_tsegiin_medeelel.html">
                        <img src="../files/spot_img_eg.jpg" alt="chingis_khan_statue_img">
                    </a>
                    
                </div>
                <div class="spot-info">
                    <h3>${title}</h3>
                    <div class="rating">
                        <div class="readOnly-rating-stars">
                            <svg class="star">
                                <use href="../styles/icons.svg#icon-star-filled"></use>
                            </svg>
                            <svg class="star">
                                <use href="../styles/icons.svg#icon-star-filled"></use>
                            </svg>
                            <svg class="star">
                                <use href="../styles/icons.svg#icon-star-filled"></use>
                            </svg>
                            <svg class="star">
                                <use href="../styles/icons.svg#icon-star-filled"></use>
                            </svg>
                            <svg class="star">
                                <use href="../styles/icons.svg#icon-star-filled"></use>
                            </svg>
                        </div>
                        <p class="rating-num">${unelgee}</p>
                    </div>
                    <ul>
                        <li>Аяллын төрөл1</li>
                        <li>Аяллын төрөл2</li>
                        <li>Үйл ажиллагаа</li>
                    </ul>
                    <p>Бүс нутаг: ${bus}</p>
                    <p>Тасалбарын эхлэх үнэ: ${une}</p>
                    <div class="action-btns">
                            <button class="btn"><svg><use href="../styles/icons.svg#icon-add"></use></svg></button>
                            <button class="btn"><svg><use href="../styles/icons.svg#icon-share"></use></svg></button>
                    </div>
                </div>
            </article>`;

    }

    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldVal, newVal) {
    }

    adoptedCallback() {
    }

}

window.customElements.define('spot-card', SpotCard);