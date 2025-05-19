document.addEventListener("DOMContentLoaded", function () {
  const cartTableBody = document.getElementById("cart-table-body");
  const cartTotalEl = document.getElementById("cart-total");
  const clearCartBtn = document.getElementById("clear-cart");

  const CART_KEY = "cartItems";
  let cartItems = JSON.parse(localStorage.getItem(CART_KEY)) || [];

  function updateCartDisplay() {
    cartTableBody.innerHTML = "";
    let totalCost = 0;

    cartItems.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      totalCost += itemTotal;

      const row = document.createElement("tr");
      row.className = "border-b";

      row.innerHTML = `
        <td class="py-3 px-4">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
        </td>
        <td class="py-3 px-4">${item.name}</td>
        <td class="py-3 px-4">R${item.price.toFixed(2)}</td>
        <td class="py-3 px-4">
          <input type="number" min="1" value="${item.quantity}" data-index="${index}"
                 class="quantity-input border rounded w-16 text-center py-1 px-2">
        </td>
        <td class="py-3 px-4">R${itemTotal.toFixed(2)}</td>
        <td class="py-3 px-4">
          <button class="remove-btn text-red-500 hover:underline" data-index="${index}">Remove</button>
        </td>
      `;

      cartTableBody.appendChild(row);
    });

    cartTotalEl.textContent = totalCost.toFixed(2);
    attachListeners();
  }

  function clearCart() {
    cartItems = [];
    localStorage.removeItem(CART_KEY);
    updateCartDisplay();
    alert("Cart has been cleared.");
  }

  function attachListeners() {
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        cartItems.splice(index, 1);
        localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
        updateCartDisplay();
      });
    });

    document.querySelectorAll(".quantity-input").forEach(input => {
      input.addEventListener("change", function () {
        const index = parseInt(this.getAttribute("data-index"));
        let newQty = parseInt(this.value);
        if (isNaN(newQty) || newQty < 1) newQty = 1;
        cartItems[index].quantity = newQty;
        localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
        updateCartDisplay();
      });
    });
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart);
  }

  updateCartDisplay();

  // ✅ Proceed to Checkout button logic
  const proceedToCheckoutBtn = document.getElementById("proceed-to-checkout");

  if (proceedToCheckoutBtn) {
    proceedToCheckoutBtn.addEventListener("click", () => {
      const checkoutCart = cartItems.map(item => ({
        ...item,
        qty: item.quantity // convert to expected key for checkout page
      }));

      localStorage.setItem("checkoutCart", JSON.stringify(checkoutCart));
      window.location.href = "checkout.html"; // update if your filename is different
    });
  }
});
