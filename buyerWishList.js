let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart     = JSON.parse(localStorage.getItem("cart"))     || [];

function saveWishlist() {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderWishlist() {
  const wishlistBody = document.getElementById("wishlist-body");
  wishlistBody.innerHTML = "";

  if (wishlist.length === 0) {
    wishlistBody.innerHTML = `
      <tr>
        <td colspan="5" class="p-6 text-center text-gray-500">
          Your wishlist is empty.
          <a href="shopproducts.html" class="ml-2 text-teal-600 underline hover:text-teal-800">Return to Shop</a>
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

  // Check if item already in cart
  const existing = cart.find(c => c.name === item.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  // Remove from wishlist
  wishlist.splice(index, 1);

  saveWishlist();
  saveCart();
  renderWishlist();

  alert(`"${item.name}" added to your cart!`);
}

function removeFromWishlist(index) {
  const item = wishlist[index];
  if (confirm(`Remove "${item.name}" from your wishlist?`)) {
    wishlist.splice(index, 1);
    saveWishlist();
    renderWishlist();
  }
}

renderWishlist();
