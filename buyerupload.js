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

window.onload = async () => {
  const container = document.getElementById("buyerProductsContainer");
  container.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach(doc => {
    const product = doc.data();
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" style="width: 150px; height: auto;" />
      <h4>${product.name}</h4>
      <p>${product.desc}</p>
      <strong>R${product.price}</strong>
      <br/>
      <button>Add to Cart</button>
    `;
    container.appendChild(card);
  });
};
