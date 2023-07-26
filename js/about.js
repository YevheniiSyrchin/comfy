let furnitureList = [];

document.addEventListener("DOMContentLoaded", () => {
  const cartButton = document.querySelector(".cartButton");
  const overlay = document.querySelector(".overlay");

  cartButton.addEventListener("click", openCart);
  overlay.addEventListener("click", closeCart);

  fetch("furniture.json")
    .then((response) => response.json())
    .then((data) => {
      furnitureList = data.furniture;
      loadCartFromStorage();
    });
});
