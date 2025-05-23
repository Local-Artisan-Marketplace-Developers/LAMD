
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDV_AUjMqtpPMy5Yp4Wkwj-mCw9bCOE_-8",
  authDomain: "artisanavenue-13a8d.firebaseapp.com",
  projectId: "artisanavenue-13a8d",
  storageBucket: "artisanavenue-13a8d.firebasestorage.app",
  messagingSenderId: "957096144049",
  appId: "1:957096144049:web:d6c577dc7fec5a3e8b8690",
  measurementId: "G-H2XGRYH35C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function attachWishlistAndCartListeners() {
  const productCards = document.querySelectorAll('section.py-10.bg-white div.bg-gray-100');

  productCards.forEach(card => {
    const productId = card.getAttribute("data-id");
    const image = card.querySelector("img").src;
    const name = card.querySelector("h3").textContent;
    const desc = card.querySelector("p.text-sm").textContent;
    const price = card.querySelector("p.text-lg").textContent;

    const wishlistBtn = card.querySelector("button[title='Add to Wishlist']");
    const cartBtn = card.querySelector("button[title='Add to Cart']");

    wishlistBtn.addEventListener("click", () => {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const alreadyInWishlist = wishlist.some(item => item.id === productId);
      if (!alreadyInWishlist) {
        wishlist.push({ id: productId, name, desc, price, image });
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert("Added to wishlist!");
      } else {
        alert("Already in wishlist.");
      }
    });

    cartBtn.addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const alreadyInCart = cart.some(item => item.id === productId);
      if (!alreadyInCart) {
        cart.push({ id: productId, name, desc, price, image });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Added to cart!");
      } else {
        alert("Already in cart.");
      }
    });
  });
}

window.onload = async () => {
  const container = document.getElementById("buyerProductsContainer");
  container.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach(doc => {
    const product = doc.data();
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-id", doc.id);
    card.innerHTML = `
    <div class="bg-white shadow-lg p-4 rounded-lg flex flex-col items-center">
        <img src="${product.image}" alt="${product.name}" class="w-40 h-40 object-cover rounded-md" />
        <h4 class="mt-2 text-lg font-semibold">${product.name}</h4>
        <p class="text-sm text-gray-600">${product.desc}</p>
        <strong class="text-teal-600 text-lg font-bold">R${product.price}</strong>
        <div class="flex space-x-4 mt-4">
        <button title="Add to Wishlist" class="text-gray-500 hover:text-red-600"><i class="fas fa-heart"></i></button>
        <button title="Add to Cart" class="text-gray-500 hover:text-teal-600"><i class="fas fa-shopping-cart"></i></button>
        </div>
    </div>
    `;
    container.appendChild(card);
    
  });

  attachWishlistAndCartListeners();
};
