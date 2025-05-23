
document.addEventListener('DOMContentLoaded', () => {
  const menuToggleBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  menuToggleBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
  });

  function getLocalStorageArray(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  function saveLocalStorageArray(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
  }

  const WISHLIST_KEY = 'wishlistItems';
  const CART_KEY = 'cartItems';

  function showFeedback(message) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.className = 'fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded shadow-md z-50';
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 3000);
  }

  const productCards = document.querySelectorAll('section.py-10.bg-white div.bg-gray-100');

  productCards.forEach(card => {
    const productName = card.querySelector('h3')?.textContent.trim();
    if (!productName) return;

    const wishlistBtn = card.querySelector('button[title="Add to Wishlist"]');
    const cartBtn = card.querySelector('button[title="Add to Cart"]');
    const wishlistIcon = wishlistBtn?.querySelector('i');
    const cartIcon = cartBtn?.querySelector('i');
    const priceText = card.querySelector('p.text-teal-600')?.textContent.trim();
    const price = parseFloat(priceText?.replace(/[^\d.]/g, '')) || 0;
    const image = card.querySelector('img')?.getAttribute('src') || '';
    const productId = card.getAttribute('data-id') || productName.toLowerCase().replace(/\s+/g, '-');

    // --- Wishlist Logic ---
    if (wishlistBtn && wishlistIcon) {
      let wishlist = getLocalStorageArray(WISHLIST_KEY);
      const isInWishlist = wishlist.some(item => item.id === productId);

      // Set initial icon state
      wishlistIcon.classList.remove('fa-regular', 'fas', 'text-gray-500', 'text-green-600');
      wishlistIcon.classList.add(isInWishlist ? 'fas' : 'fa-regular');
      wishlistIcon.classList.add(isInWishlist ? 'text-green-600' : 'text-gray-500');

      wishlistBtn.addEventListener('click', () => {
        wishlist = getLocalStorageArray(WISHLIST_KEY); // Reload in case of external updates
        const index = wishlist.findIndex(item => item.id === productId);

        if (index !== -1) {
          wishlist.splice(index, 1); // Remove from wishlist
          wishlistIcon.classList.remove('fas', 'text-green-600');
          wishlistIcon.classList.add('fa-regular', 'text-gray-500');
          showFeedback(`${productName} removed from Wishlist.`);
        } else {
          wishlist.push({ id: productId, name: productName, price, image });
          wishlistIcon.classList.remove('fa-regular', 'text-gray-500');
          wishlistIcon.classList.add('fas', 'text-green-600');
          showFeedback(`${productName} added to Wishlist.`);
        }

        saveLocalStorageArray(WISHLIST_KEY, wishlist);
      });
    }

    // --- Cart Logic ---
    if (cartBtn && cartIcon) {
      let cart = getLocalStorageArray(CART_KEY);
      const isInCart = cart.some(item => item.id === productId);

      if (isInCart) {
        cartIcon.classList.add('fas', 'text-green-600');
      } else {
        cartIcon.classList.add('fa-regular', 'text-gray-500');
      }

      cartBtn.addEventListener('click', () => {
        cart = getLocalStorageArray(CART_KEY);
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
          existingItem.quantity += 1;
          showFeedback(`${productName} quantity increased in Cart.`);
        } else {
          cart.push({ id: productId, name: productName, price, quantity: 1, image });
          showFeedback(`${productName} added to Cart.`);
        }

        saveLocalStorageArray(CART_KEY, cart);
        cartIcon.classList.remove('fa-regular', 'text-gray-500');
        cartIcon.classList.add('fas', 'text-green-600');
      });
    }
  });
});
