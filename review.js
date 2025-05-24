import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth,setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js"; 
import { getFirestore, doc, setDoc, getDocs, collection,deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
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
const querySnapshots = await getDocs(collection(db, "sellers"));
    querySnapshots.forEach(docSnap => {
        const p = docSnap.data();
        sellerInfo.innerHTML +=`
            <p>Name: ${p.name}    |    Email: ${p.email}</p>
            ${loadProducts()}
        `;
    });
async function loadProducts() {
    const container = document.getElementById("sellerInfo");
    container.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach(docSnap => {
        const p = docSnap.data();
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${p.image}" alt="${p.name}" />
                <h4>${p.name}</h4>
                <p>${p.desc}</p>
                <strong>R${p.price}</strong>
                <button class="remove-btn">Remove</button>
            `;
            const removeBtn = card.querySelector(".remove-btn");
            removeBtn.addEventListener("click", () => deleteProduct(docSnap.id));
            container.appendChild(card);
    });
}
async function deleteProduct(id) {
    if (confirm("Are you sure you want to remove this product?")) {
        await deleteDoc(doc(db, "products", id));
        alert("Product removed.");
        loadProducts();
    }
}
});


