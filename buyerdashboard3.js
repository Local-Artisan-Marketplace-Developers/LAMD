let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

function saveWishlist() {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function saveOrders() {
  localStorage.setItem("orders", JSON.stringify(orders));
}

function renderOrders() {
    const container = document.getElementById("orders-container");
    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = `
        <section class="text-center p-6 bg-white rounded shadow">
            <p class="mb-4 text-gray-500">You have no orders yet.</p>
            <a href="index.html" class="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Browse Products</a>
        </section>`;
        return;
    }

    orders.forEach((order, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td class="p-3 border-b">
            <img src="${order.image}" alt="${order.name}" class="h-16 w-16 object-cover rounded">
        </td>
        <td class="p-3 border-b">${order.name}</td>
        <td class="p-3 border-b">R${order.price.toFixed(2)}</td>
        <td class="p-3 border-b ${order.status.toLowerCase() === "delivered" ? "text-green-600" : order.status.toLowerCase() === "shipped" ? "text-blue-500" : "text-gray-500"}">
            ${order.status}
        </td>
        <td class="p-3 border-b">
            <button onclick="removeOrder(${index})" class="text-red-500 hover:text-red-700 text-xl font-bold">&times;</button>
        </td>
        `;
        container.appendChild(row);
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
    wishlistBody.innerHTML = `
      <tr>
        <td colspan="5" class="p-6 text-center text-gray-500">
          Your wishlist is empty.
          <a href="index.html" class="ml-2 text-teal-600 underline hover:text-teal-800">Return to Shop</a>
        </td>
      </tr>`;
    return;
  }

  wishlist.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-3 border-b">
        <img src="${item.image}" alt="${item.name}" class="h-16 w-16 object-cover rounded">
      </td>
      <td class="p-3 border-b">${item.name}</td>
      <td class="p-3 border-b">R${item.price.toFixed(2)}</td>
      <td class="p-3 border-b ${item.available ? 'text-green-600' : 'text-red-500'}">
        ${item.available ? "In Stock" : "Out of Stock"}
      </td>
      <td class="p-3 border-b space-x-2">
        <button onclick="addToCart(${index})" class="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm">Add to Cart</button>
        <button onclick="removeFromWishlist(${index})" class="text-red-500 hover:text-red-700 text-xl font-bold">&times;</button>
      </td>
    `;
    wishlistBody.appendChild(row);
  });
}

function addToCart(index) {
  const item = wishlist[index];

  // Add to orders
  orders.push({
    name: item.name,
    image: item.image,
    price: item.price,
    status: "Processing"
  });

  wishlist.splice(index, 1);
  saveWishlist();
  saveOrders();
  renderWishlist();
  renderOrders();

  alert(`"${item.name}" moved to Orders!`);
}

function removeFromWishlist(index) {
  const item = wishlist[index];
  if (confirm(`Remove "${item.name}" from your wishlist?`)) {
    wishlist.splice(index, 1);
    saveWishlist();
    renderWishlist();
  }
}

// Example demo data (only if localStorage is empty)
if (wishlist.length === 0 && orders.length === 0) {
  wishlist.push({
    name: "Preserved Green Figs",
    image: "https://via.placeholder.com/100",
    price: 65.00,
    available: true
  });
  wishlist.push({
    name: "Preserved Rooibos Figs",
    image: "https://via.placeholder.com/100",
    price: 30.00,
    available: true
  });

  orders.push({
    name: "Raw Honey (500ml)",
    image: "https://via.placeholder.com/100",
    price: 120.00,
    status: "Shipped"
  });

  orders.push({
    name: "Raw Liver (2kg)",
    image: "https://via.placeholder.com/100",
    price: 190.00,
    status: "Delivered"
  });
  saveWishlist();
  saveOrders();
}

renderOrders();
renderWishlist();
