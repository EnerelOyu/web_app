document.addEventListener("DOMContentLoaded", () => {
  const guides = document.querySelector(".guides");
  const leftBtn = document.querySelector(".scrl-left");
  const rightBtn = document.querySelector(".scrl-right");

  const STEP = 300;

  leftBtn.addEventListener("click", () => {
    guides.scrollBy({ left: -STEP, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    guides.scrollBy({ left: STEP, behavior: "smooth" });
  });
});
