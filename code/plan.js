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
            <section>
                <div class="top-route">
                    <svg role="img" area-label="route">
                        <use xlink:href="../styles/icons.svg#top-route"></use>
                    </svg>
                    <button type="button" class="add-btn">Нэмэх</button>
                </div>

                <div class="rt-details">
                    <svg id="drag" role="icon" aria-label="drag">
                            <use xlink:href="../styles/icons.svg#drag"></use>
                        </svg>
                    <div class="text-box">    
                        <h3>Аяллын цэгийн гарчиг</h3>
                        <p class="loc_text">Газрын байршил</p>
                        <p>Энэ тайлбарт эхлэх үнэ, цагийн хуваарь байх болно. Мөн анхаарах зүйлсийг хүн өөрөө нэмэлтээр оруулж өөрчилж болно.</p>
                    </div>
                    <img src="../files/11statue1.jpg" alt="">
                    <!-- <span class="delete">Цуцлах</span> -->
                    <div class="inst">
                        <svg>
                            <use href="../styles/icons.svg#icon-add"></use>
                        </svg>
                        <label for="guide">Хөтөч сонгох</label>
                        <select id="guide" name="guide">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
            </section>
        `;
    }

    attributeChangedCallback() { }

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

// class planPoint  extends HTMLElement {
//     constructor() {
//         super();
//     }

//     connectedCallback() {
//         // const unelgee=this.getAttribute("rating") || "0.0";
//         // const title = this.getAttribute("title") ||"Unknown";
//         // const location = this.getAttribute("area") || "unknown";
//         // const liked = this.getAttribute("like") || "false"
//         this.innerHTML=`<article style="background-image: url(../files/12Landscape1.jpg);" class="TP">
//                     <div class="tp_ic">
//                         <svg>
//                             <use href="../styles/icons.svg#icon-star-filled"></use>
//                             <use href="../styles/icons.svg#icon-star-filled"></use>
//                             <use href="../styles/icons.svg#icon-star-filled"></use>
//                             <use href="../styles/icons.svg#icon-star-filled"></use>
//                             <use href="../styles/icons.svg#icon-star-filled"></use>
//                         </svg>
//                         <svg>
//                             <use href="../styles/icons.svg#icon-add"></use>
//                         </svg>
//                     </div>
//                     <p>Цэгийн нэр</p>
//                     <p>Байршил</p>
//                 </article>
//         `;
//     }

//     disconnectedCallback() {
//         //implementation
//     }

//     attributeChangedCallback(name, oldVal, newVal) {
//         //implementation
//     }

//     adoptedCallback() {
//         //implementation
//     }
// }
// window.customElements.define('plan-point', planPoint);