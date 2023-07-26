let furnitureList = [];

document.addEventListener("DOMContentLoaded", () => {
  const cartButton = document.querySelector(".cartButton");
  const overlay = document.querySelector(".overlay");
  const cartItemsContainer = document.querySelector(".cartItems");

  cartButton.addEventListener("click", openCart);
  overlay.addEventListener("click", closeCart);

  fetch("furniture.json")
    .then((response) => response.json())
    .then((data) => {
      furnitureList = data.furniture;
      loadCartFromStorage();
      renderRandomProducts();
      loadCartScript();
    });

  function renderRandomProducts() {
    const randomProducts = getRandomElements(furnitureList, 3);
    const randomProductsContainer = document.getElementById("random-products");

    randomProductsContainer.innerHTML = randomProducts
      .map((product) => {
        return `
          <li>
            <div>
              <img class="product-image" src="${product.photo}" alt="${product.name}">
              <h2>${product.name}</h2>
              <span>$${product.price}</span>
            </div>
          </li>
        `;
      })
      .join("");

    const productItems =
      randomProductsContainer.querySelectorAll(".product-image");
    productItems.forEach((item, index) => {
      const selectedProduct = randomProducts[index];
      item.addEventListener("click", () => {
        addToCart(selectedProduct.id, furnitureList, cartItemsContainer);
      });
    });
  }

  function loadCartScript() {
    const cartScript = document.createElement("script");
    cartScript.src = "./js/cart.js";
    cartScript.setAttribute(
      "data-furniture-list",
      JSON.stringify(furnitureList)
    );
    document.body.appendChild(cartScript);
  }

  function getRandomElements(arr, count) {
    const shuffled = arr.slice();
    let i = arr.length;
    let temp;
    let index;

    while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }

    return shuffled.slice(0, count);
  }
});
