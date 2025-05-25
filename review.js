import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth,setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js"; 
import { getFirestore, doc, setDoc, getDoc, getDocs, collection,deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-storage.js";
window.addEventListener("DOMContentLoaded", async () => {

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
const storage = getStorage(app);
const auth = getAuth(app);
const users = auth.currentUser;
const db = getFirestore(app); 

const sellerInfo = document.getElementById("sellerInfo");
sellerInfo.innerHTML =
    loadProducts()
;
async function loadProducts() {
    const container = document.getElementById("sellerInfo");
    container.innerHTML = "";

    const productSnapshot = await getDocs(collection(db, "products"));

    for (const docSnap of productSnapshot.docs) {
        const product = docSnap.data();
        const productId = docSnap.id;

        // 🔍 Fetch seller info from the sellerId field in the product document
        let sellerName = "Unknown";
        let sellerEmail = "Unknown";

        if (product.sellerId) {
            const sellerRef = doc(db, "sellers", product.sellerId);
            const sellerSnap = await getDoc(sellerRef);

            if (sellerSnap.exists()) {
                const sellerData = sellerSnap.data();
                sellerName = sellerData.name || sellerName;
                sellerEmail = sellerData.email || sellerEmail;
            }
        }

        // 🎨 Create and display product card with seller info
        const card = document.createElement("div");
        card.className = "product-card border p-4 mb-4 rounded bg-white shadow";
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-32 h-32 object-cover mb-2"/>
            <h4 class="text-gray-600 font-semibold">${product.name}</h4>
            <p class="text-gray-600 font-semibold">${product.desc}</p>
            <strong class="text-gray-600 block mb-1">R${product.price}</strong>
            <p class="text-sm text-gray-600 font-semibold">Sold by: ${sellerName} (${sellerEmail})</p>
            <button class="remove-btn bg-red-500 text-white px-3 py-1 mt-2 rounded">Remove</button>
        `;

        const removeBtn = card.querySelector(".remove-btn");
        removeBtn.addEventListener("click", () => deleteProduct(productId));

        container.appendChild(card);
    }
}

async function deleteProduct(id) {
    if (confirm("Are you sure you want to remove this product?")) {
        await deleteDoc(doc(db, "products", id));
        alert("Product removed.");
        loadProducts();
    }
}
});


