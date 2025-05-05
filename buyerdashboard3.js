// Inject mock data only if not in test environment
if (typeof window !== 'undefined' && !window.__TEST__) {
  localStorage.setItem("wishlist", JSON.stringify([
    { name: "Preserved Green Figs", image: "https://via.placeholder.com/100", price: 65.0, available: true },
    { name: "Preserved Rooibos Figs", image: "https://via.placeholder.com/100", price: 30.0, available: true }
  ]));

  localStorage.setItem("orders", JSON.stringify([
    { name: "Raw Honey (500ml)", image: "https://via.placeholder.com/100", price: 120.0, status: "Shipped" },
    { name: "Raw Liver (2kg)", image: "https://via.placeholder.com/100", price: 190.0, status: "Delivered" }
  ]));

  localStorage.setItem("cart", JSON.stringify([]));
}

import { loadFromStorage, saveToStorage, formatPrice, getStatusClass } from "./utils/dashboardUtils.js";

let wishlist = loadFromStorage("wishlist") || [];
let orders = loadFromStorage("orders") || [];
let cart = loadFromStorage("cart") || [];

function saveWishlist() {
  saveToStorage("wishlist", wishlist);
}

function saveOrders() {
  saveToStorage("orders", orders);
}

function saveCart() {
  saveToStorage("cart", cart);
}

function renderOrders() {
  const container = document.getElementById("orders-container");
  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = `<tr><td colspan="5" class="text-center p-6 text-gray-500">You have no orders yet. <a href="index.html" class="ml-2 text-teal-600 underline hover:text-teal-800">Browse Products</a></td></tr>`;
    return;
  }

  orders.forEach((order, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-3 border-b"><img src="${order.image}" alt="${order.name}" class="h-16 w-16 object-cover rounded"></td>
      <td class="p-3 border-b">${order.name}</td>
      <td class="p-3 border-b">${formatPrice(order.price)}</td>
      <td class="p-3 border-b ${getStatusClass(order.status)}">${order.status}</td>
      <td class="p-3 border-b"><button class="remove-order text-red-500 hover:text-red-700 text-xl font-bold" data-index="${index}">&times;</button></td>
    `;
    container.appendChild(row);
  });

  document.querySelectorAll(".remove-order").forEach(button => {
    button.addEventListener("click", () => {
      const index = parseInt(button.dataset.index);
      removeOrder(index);
    });
  });
}

function removeOrder(index) {
  if (confirm(`Remove order for "${orders[index].name}"?`)) {
    orders.splice(index, 1);
    saveOrders();
    renderOrders();
  }
}

function renderWishlist() {
  const wishlistBody = document.getElementById("wishlist-body");
  wishlistBody.innerHTML = "";

  if (wishlist.length === 0) {
    wishlistBody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-gray-500">Your wishlist is empty. <a href="index.html" class="ml-2 text-teal-600 underline hover:text-teal-800">Return to Shop</a></td></tr>`;
    return;
  }

  wishlist.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-3 border-b"><img src="${item.image}" alt="${item.name}" class="h-16 w-16 object-cover rounded"></td>
      <td class="p-3 border-b">${item.name}</td>
      <td class="p-3 border-b">${formatPrice(item.price)}</td>
      <td class="p-3 border-b ${item.available ? 'text-green-600' : 'text-red-500'}">${item.available ? "In Stock" : "Out of Stock"}</td>
      <td class="p-3 border-b space-x-2">
        <button class="add-to-cart bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm" data-index="${index}">Add to Cart</button>
        <button class="remove-wishlist text-red-500 hover:text-red-700 text-xl font-bold" data-index="${index}">&times;</button>
      </td>
    `;
    wishlistBody.appendChild(row);
  });

  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const index = parseInt(button.dataset.index);
      addToCart(index);
    });
  });

  document.querySelectorAll(".remove-wishlist").forEach(button => {
    button.addEventListener("click", () => {
      const index = parseInt(button.dataset.index);
      removeFromWishlist(index);
    });
  });
}

function addToCart(index) {
  const item = wishlist[index];
  cart.push({ name: item.name, image: item.image, price: item.price, qty: 1 });

  wishlist.splice(index, 1);
  saveWishlist();
  saveCart();
  renderWishlist();
  renderCart();

  alert(`"${item.name}" added to cart!`);
}

function removeFromWishlist(index) {
  const item = wishlist[index];
  if (confirm(`Remove "${item.name}" from your wishlist?`)) {
    wishlist.splice(index, 1);
    saveWishlist();
    renderWishlist();
  }
}

function renderCart() {
  const cartContainer = document.getElementById("cart-container");
  if (!cartContainer) return;

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="text-gray-500 text-center">Your cart is empty.</p>`;
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "flex items-center justify-between border-b py-2";
    div.innerHTML = `
      <div class="flex items-center space-x-4">
        <img src="${item.image}" alt="${item.name}" class="h-12 w-12 object-cover rounded">
        <div>
          <p class="font-medium">${item.name}</p>
          <p class="text-sm text-gray-600">${formatPrice(item.price)} × ${item.qty}</p>
        </div>
      </div>
      <button class="remove-cart-item text-red-500 hover:text-red-700 font-bold text-xl" data-index="${index}">&times;</button>
    `;
    cartContainer.appendChild(div);
  });

  document.querySelectorAll(".remove-cart-item").forEach(button => {
    button.addEventListener("click", () => {
      const index = parseInt(button.dataset.index);
      cart.splice(index, 1);
      saveCart();
      renderCart();
    });
  });
}

// Initial render
renderOrders();
renderWishlist();

// ✅ Export for testing
export {
  addToCart,
  removeFromWishlist,
  removeOrder,
  renderOrders,
  renderWishlist,
  renderCart,
  wishlist,
  orders,
  cart
};
