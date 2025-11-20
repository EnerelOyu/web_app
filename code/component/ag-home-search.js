document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const area = document.getElementById("areas").value;
    const category = document.getElementById("categories").value;

    const params = new URLSearchParams();

    if (area) params.set("bus", area);       
    if (category) params.set("cate", category); 

    window.location.href = `../code/spots.html?${params.toString()}`;
  });
});
