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

      const productsContainer = document.querySelector(".products");
      const productsList = document.createElement("ul");
      productsList.classList.add("products-list");

      let filteredFurniture = [...furnitureList];

      const updateProductsList = () => {
        productsList.innerHTML = "";

        const createHtmlTag = (tagName) => document.createElement(tagName);

        for (let i = 0; i < filteredFurniture.length; i++) {
          const furnitureItem = filteredFurniture[i];
          const productListItem = createHtmlTag("li");
          const productImageContainer = createHtmlTag("div");
          const productImage = createHtmlTag("img");
          const productName = createHtmlTag("h2");
          const productPrice = createHtmlTag("span");

          productPrice.classList.add("product-price");
          productImage.classList.add("product-image");
          productImage.src = furnitureItem.photo;
          productImage.alt = furnitureItem.name;
          productName.textContent = furnitureItem.name;
          productPrice.textContent = `$${furnitureItem.price}`;
          productPrice.setAttribute("id", `product-price-${furnitureItem.id}`);
          productListItem.appendChild(productImageContainer);
          productImageContainer.appendChild(productImage);
          productListItem.appendChild(productName);
          productListItem.appendChild(productPrice);
          productsList.appendChild(productListItem);

          productListItem.addEventListener("click", () => {
            addToCart(furnitureItem.id, furnitureList, cartItemsContainer);
          });
        }

        productsContainer.appendChild(productsList);
      };

      const searchInput = document.querySelector("#search-input");

      searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();

        filteredFurniture = furnitureList.filter((item) =>
          item.name.toLowerCase().includes(searchTerm)
        );

        applyFilters();
      });

      const companyFilter = document.querySelectorAll(".company-filter li");

      const updateFilterCounters = () => {
        const selectedCompanies = Array.from(companyFilter).reduce(
          (result, item) => {
            const checkbox = item.querySelector("input[type='checkbox']");
            if (checkbox.checked) {
              const company = item.getAttribute("data-company");
              result.push(company);
            }
            return result;
          },
          []
        );

        companyFilter.forEach((option) => {
          const company = option.getAttribute("data-company");
          const checkbox = option.querySelector("input[type='checkbox']");
          let counter = option.querySelector(".filter-counter");

          if (!counter) {
            counter = document.createElement("span");
            counter.classList.add("filter-counter");
            option.appendChild(counter);
          }

          const count = filteredFurniture.filter(
            (item) => item.company === company
          ).length;
          counter.textContent = count;
          counter.classList.toggle("inactive", count === 0);
          counter.style.display =
            checkbox.checked && count > 0 ? "inline" : "none";
        });
      };

      companyFilter.forEach((option) => {
        const checkbox = option.querySelector("input[type='checkbox']");

        checkbox.addEventListener("change", () => {
          applyFilters();
        });
      });

      const priceSlider = document.querySelector("#price-slider");
      const priceRange = document.querySelector("#price-range");

      priceSlider.addEventListener("input", () => {
        applyFilters();
        priceRange.textContent = `Value: $${priceSlider.value}`;
      });

      const applyFilters = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCompanies = Array.from(companyFilter).reduce(
          (result, item) => {
            const checkbox = item.querySelector("input[type='checkbox']");
            if (checkbox.checked) {
              const company = item.getAttribute("data-company");
              result.push(company);
            }
            return result;
          },
          []
        );

        const priceThreshold = parseInt(priceSlider.value);

        filteredFurniture = furnitureList.filter((item) => {
          const matchesSearch = item.name.toLowerCase().includes(searchTerm);
          const matchesCompany =
            selectedCompanies.length === 0 ||
            selectedCompanies.includes(item.company);
          const matchesPrice = item.price <= priceThreshold;
          return matchesSearch && matchesCompany && matchesPrice;
        });

        updateFilterCounters();
        updateProductsList();
      };

      updateFilterCounters();
      updateProductsList();

      // CART
      const cartScript = document.createElement("script");
      cartScript.src = "./js/cart.js";
      cartScript.setAttribute(
        "data-furniture-list",
        JSON.stringify(furnitureList)
      );
      cartScript.setAttribute(
        "data-cart-items-container",
        "cartItemsContainerSelector"
      );
      document.body.appendChild(cartScript);

      loadCartFromStorage();
    });
});
