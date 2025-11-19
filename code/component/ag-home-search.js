// ../code/component/ag-home-search.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const area = document.getElementById("areas").value;
    const category = document.getElementById("categories").value;

    // ⚠ АНХААР: энд URL дээрх параметрийн нэр нь
    // spots.html дээр ашиглахтайгаа таарах ёстой
    const params = new URLSearchParams();

    if (area) params.set("bus", area);       // бүсийг bus гэж дамжуулна
    if (category) params.set("cate", category); // категорииг cate гэж дамжуулна

    window.location.href = `../code/spots.html?${params.toString()}`;
  });
});
