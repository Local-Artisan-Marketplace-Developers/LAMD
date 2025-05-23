// buyerDashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
//import { getStorage,getDocs } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-storage.js";

// Firebase config (reuse from your app)
const firebaseConfig = {
  apiKey: "AIzaSyDV_AUjMqtpPMy5Yp4Wkwj-mCw9bCOE_-8",
  authDomain: "artisanavenue-13a8d.firebaseapp.com",
  projectId: "artisanavenue-13a8d",
  storageBucket: "rtisanavenue-13a8d.firebasestorage.app",
  messagingSenderId: "957096144049",
  appId: "1:957096144049:web:d6c577dc7fec5a3e8b8690",
  measurementId: "G-H2XGRYH35C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const menuToggleBtn = document.getElementById('menu-toggle'); // Ensure ID exists
const mobileMenu = document.getElementById('mobile-menu');

menuToggleBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
});
function getLocalStorageArray(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveLocalStorageArray(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
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

window.onload = async () => {
  const container = document.getElementById("buyerProductsContainer");
  container.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach(doc => {
    const product = doc.data();
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
    <div class="bg-white shadow-lg p-4 rounded-lg flex flex-col items-center">
        <img src="${product.image}" alt="${product.name}" class="w-40 h-40 object-cover rounded-md" />
        <h4 class="mt-2 text-lg font-semibold">${product.name}</h4>
        <p class="text-sm text-gray-600">${product.desc}</p>
        <strong class="text-teal-600 text-lg font-bold">R${product.price}</strong>
        <div class="flex space-x-4 mt-4">
        <button class="text-gray-500 hover:text-red-600"><i class="fas fa-heart"></i></button>
        <button class="text-gray-500 hover:text-teal-600"><i class="fas fa-shopping-cart"></i></button>
        </div>
    </div>
    `;
    container.appendChild(card);
  });
};
