function getRemoveAllButton() {
  return document.querySelector(".removeAllButton");
}

document.addEventListener("DOMContentLoaded", () => {
  loadCartFromStorage();

  const removeAllButton = document.querySelector(".removeAllButton");
  const closeButton = document.querySelector(".closeButton");

  removeAllButton.addEventListener("click", removeAllItems);
  closeButton.addEventListener("click", closeCart);

  function removeAllItems() {
    const cartItems = document.querySelectorAll(".cart-item");
    cartItems.forEach((cartItem) => {
      cartItem.remove();
    });
    saveCartToStorage();
    updateCartCount();
  }
});

function addToCart(productId, furnitureList, cartItemsContainer) {
  const selectedProduct = furnitureList.find(
    (product) => product.id === productId
  );
  const existingCartItem = document.querySelector(
    `.cart-item[data-product-id="${productId}"]`
  );

  if (existingCartItem) {
    const quantityInput = existingCartItem.querySelector(".cart-item-quantity");
    let quantity = parseInt(quantityInput.value);
    quantity++;
    quantityInput.value = quantity;
  } else {
    const cartItem = createCartItemElement(selectedProduct);
    cartItemsContainer.appendChild(cartItem);
  }

  updateCartCount();
  saveCartToStorage();
}

function createCartItemElement(product) {
  const cartItem = document.createElement("li");
  cartItem.classList.add("cart-item");
  cartItem.setAttribute("data-product-id", product.id);
  cartItem.setAttribute("data-price", product.price);

  const createHtmlTag = (tagName) => document.createElement(tagName);

  const productContainer = createHtmlTag("div");
  const productImage = createHtmlTag("div");
  const productInfo = createHtmlTag("div");
  const productName = createHtmlTag("span");
  const productPrice = createHtmlTag("span");
  const removeButton = createHtmlTag("button");
  const counter = createCounter(product.id);

  const addClass = (element, className) => element.classList.add(className);

  addClass(productContainer, "product-container");
  addClass(productImage, "product-image");
  addClass(productInfo, "product-info");
  addClass(removeButton, "remove-button");

  productImage.style.backgroundImage = `url(${product.photo})`;
  productName.textContent = product.name;
  productPrice.textContent = `$${product.price}`;
  removeButton.textContent = "remove";

  removeButton.addEventListener("click", () => {
    removeFromCart(product.id);
  });

  const productInfoChildren = [productName, productPrice, removeButton];
  productInfoChildren.forEach((item) => productInfo.appendChild(item));

  const productContainerChildren = [productImage, productInfo, counter];
  productContainerChildren.forEach((element) =>
    productContainer.appendChild(element)
  );

  cartItem.appendChild(productContainer);

  return cartItem;
}

function createCounter(productId) {
  const counter = document.createElement("div");
  counter.classList.add("counter");

  const decreaseButton = document.createElement("button");
  decreaseButton.classList.add("decrease-button");
  decreaseButton.addEventListener("click", () => {
    decreaseCartItemQuantity(productId);
  });

  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.min = "1";
  quantityInput.value = "1";
  quantityInput.classList.add("cart-item-quantity");
  quantityInput.disabled = true;

  const increaseButton = document.createElement("button");
  increaseButton.classList.add("increase-button");
  increaseButton.addEventListener("click", () => {
    increaseCartItemQuantity(productId);
  });

  counter.appendChild(increaseButton);
  counter.appendChild(quantityInput);
  counter.appendChild(decreaseButton);

  return counter;
}

function removeFromCart(productId) {
  const selector = productId
    ? `.cart-item[data-product-id="${productId}"]`
    : ".cart-item";
  const cartItems = document.querySelectorAll(selector);
  cartItems.forEach((cartItem) => {
    cartItem.remove();
  });

  updateCartCount();
  saveCartToStorage();
}

function decreaseCartItemQuantity(productId) {
  const cartItem = document.querySelector(
    `.cart-item[data-product-id="${productId}"]`
  );
  if (cartItem) {
    const quantityInput = cartItem.querySelector(".cart-item-quantity");
    let quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
      quantity--;
      quantityInput.value = quantity;
      saveCartToStorage();
    }
    updateCartCount();
  }
}

function increaseCartItemQuantity(productId) {
  const cartItem = document.querySelector(
    `.cart-item[data-product-id="${productId}"]`
  );
  if (cartItem) {
    const quantityInput = cartItem.querySelector(".cart-item-quantity");
    let quantity = parseInt(quantityInput.value);
    quantity++;
    quantityInput.value = quantity;
    saveCartToStorage();
    updateCartCount();
  }
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  const cartTotalValue = document.querySelector(".cartTotalValue");
  const cartItems = document.querySelectorAll(".cart-item");
  let totalCount = 0;
  let totalValue = 0;

  cartItems.forEach((cartItem) => {
    const productPrice = parseFloat(cartItem.dataset.price);
    const quantity = parseInt(
      cartItem.querySelector(".cart-item-quantity").value
    );

    totalCount += quantity;
    totalValue += productPrice * quantity;
  });

  cartCount.textContent = totalCount;
  if (cartTotalValue) {
    cartTotalValue.textContent =
      totalValue !== undefined
        ? `Total: $${totalValue.toFixed(2)}`
        : "Total: $0.00";
  }

  const removeAllButton = getRemoveAllButton();
  removeAllButton.style.display = cartItems.length > 0 ? "flex" : "none";
}

function saveCartToStorage() {
  const cartItemsContainer = document.querySelector(".cartItems");
  const cartItems = Array.from(cartItemsContainer.children).map((cartItem) => {
    const productId = cartItem.getAttribute("data-product-id");
    const price = cartItem.getAttribute("data-price");
    const quantity = cartItem.querySelector(".cart-item-quantity").value;

    return { productId, price, quantity };
  });

  localStorage.setItem("cart", JSON.stringify(cartItems));
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    const cartItemsContainer = document.querySelector(".cartItems");
    const cartItems = JSON.parse(savedCart);

    cartItems.forEach((cartItem) => {
      const { productId, price, quantity } = cartItem;

      const selectedProduct = furnitureList.find(
        (product) => product.id === Number(productId)
      );

      if (selectedProduct) {
        const cartItemElement = createCartItemElement(selectedProduct);
        cartItemElement.querySelector(".cart-item-quantity").value = quantity;
        cartItemsContainer.appendChild(cartItemElement);
      }
    });

    updateCartCount();
  }
}

function openCart() {
  const cartContainer = document.querySelector(".cartContainer");
  const overlay = document.querySelector(".overlay");
  cartContainer.style.display = "flex";
  overlay.style.display = "flex";
}

function closeCart() {
  const cartContainer = document.querySelector(".cartContainer");
  const overlay = document.querySelector(".overlay");
  cartContainer.style.display = "none";
  overlay.style.display = "none";
}
