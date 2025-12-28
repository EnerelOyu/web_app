/**
 * Хөтөч жагсаалтыг хэвтээ гүйлгэх функц
 * Зүүн/баруун товчоор guide-уудыг харах боломжтой
 */
document.addEventListener("DOMContentLoaded", () => {
  const guides = document.querySelector(".guides");
  const leftBtn = document.querySelector(".scrl-left");
  const rightBtn = document.querySelector(".scrl-right");

  // Элементүүд олдсон эсэхийг шалгах (тухайн хуудас дээр байхгүй бол алдаа гаргахгүй)
  if (!guides || !leftBtn || !rightBtn) {
    return; // Элементүүд олдохгүй бол зогсоох
  }

  const STEP = 300; // Нэг товшилтод гүйлгэх зай (px)

  // Зүүн товчоор баруун тийш гүйлгэх
  leftBtn.addEventListener("click", () => {
    guides.scrollBy({ left: -STEP, behavior: "smooth" });
  });

  // Баруун товчоор зүүн тийш гүйлгэх
  rightBtn.addEventListener("click", () => {
    guides.scrollBy({ left: STEP, behavior: "smooth" });
  });
});
