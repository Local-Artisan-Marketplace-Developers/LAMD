console.log("Wishlist JS loaded");

document.addEventListener('DOMContentLoaded', () => {
  const wishlistTableBody = document.getElementById('wishlist-table-body');
  const WISHLIST_KEY = 'wishlistItems';
  const CART_KEY = 'cartItems';

  function getStorageArray(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  function saveStorageArray(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
  }

  function removeWishlistItem(id) {
    let wishlist = getStorageArray(WISHLIST_KEY);
    wishlist = wishlist.filter(item => item.id !== id);
    saveStorageArray(WISHLIST_KEY, wishlist);
    renderWishlist();
  }

  function moveToCart(item) {
    let cart = getStorageArray(CART_KEY);
    const existing = cart.find(cartItem => cartItem.id === item.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    saveStorageArray(CART_KEY, cart);
    removeWishlistItem(item.id);
  }

  function renderWishlist() {
    const wishlist = getStorageArray(WISHLIST_KEY);
    wishlistTableBody.innerHTML = '';

    if (wishlist.length === 0) {
      wishlistTableBody.innerHTML = `
        <tr><td colspan="4" class="text-center py-4 text-gray-500">Your wishlist is empty.</td></tr>
      `;
      return;
    }

    wishlist.forEach(item => {
      const row = document.createElement('tr');
      row.className = 'border-t';

      // Safe price formatting with fallback to 0.00
      const priceFormatted = (typeof item.price === 'number' && !isNaN(item.price))
        ? item.price.toFixed(2)
        : '0.00';

      row.innerHTML = `
        <td class="py-3 px-4">
          <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
        </td>
        <td class="py-3 px-4 font-semibold">${item.name}</td>
        <td class="py-3 px-4 text-teal-600 font-bold">R${priceFormatted}</td>
        <td class="py-3 px-4 space-x-2">
          <button class="remove-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" data-id="${item.id}">Remove</button>
          <button class="move-btn bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" data-id="${item.id}">Move to Cart</button>
        </td>
      `;

      // Event listeners
      row.querySelector('.remove-btn').addEventListener('click', () => removeWishlistItem(item.id));
      row.querySelector('.move-btn').addEventListener('click', () => moveToCart(item));

      wishlistTableBody.appendChild(row);
    });
  }

  renderWishlist();
});
