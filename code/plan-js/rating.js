const ratingContainer = document.getElementById("rating");
const ratingValue = document.getElementById("rating-value");
const stars = ratingContainer.querySelectorAll("svg");

let currentRating = 0;

stars.forEach((star, index) => {
  const value = index + 1;

  star.addEventListener("mouseover", () => {
    updateStars(value);
  });

  star.addEventListener("mouseout", () => {
    updateStars(currentRating);
  });

  star.addEventListener("click", () => {
    currentRating = value;
    updateStars(currentRating);
    ratingValue.textContent = `Rating: ${currentRating}`;
  });
});

function updateStars(rating) {
  stars.forEach((star, index) => {
    const use = star.querySelector("use");
    if (index < rating) {
      use.setAttribute("href", "../styles/icons.svg#icon-star-filled");
    } else {
      use.setAttribute("href", "../styles/icons.svg#icon-star-unfilled");
    }
  });
}
