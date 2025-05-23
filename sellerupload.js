import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth,setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js"; 
import { getFirestore, doc, setDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-storage.js";

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
setPersistence(auth, browserSessionPersistence)
    .then(() => {
        console.log("Session persistence enabled.");
    })
    .catch((error) => {
        console.error("Error setting persistence:", error);
    });
document.getElementById("registerBtn").addEventListener("click", () => {
    const name = document.getElementById("storeName").value.trim();
    const desc = document.getElementById("storeDesc").value.trim();

    if (!name || !desc) {
        alert("Please fill out store name and description.");
        return;
    }

    const store = { name, desc };
    localStorage.setItem("sellerStore", JSON.stringify(store));
    displayStore();
    loadProducts();

    const addProducts = confirm("Store registered successfully! Do you want to add products now?");
    if (addProducts) {
        document.getElementById("productSection").style.display = "block";
        document.getElementById("productList").style.display = "block";
        document.getElementById("reviews").style.display = "block";
    } else {
        document.getElementById("productSection").style.display = "none";
        document.getElementById("productList").style.display = "block";
        document.getElementById("reviews").style.display = "block";
    }
});
function displayStore() {
    const store = JSON.parse(localStorage.getItem("sellerStore"));
    const display = document.getElementById("storeDisplay");
    if (store) {
        display.innerHTML = `<h4>${store.name}</h4><p>${store.desc}</p>`;
        document.getElementById("productList").style.display = "block";
        document.getElementById("reviews").style.display = "block";
    }
}
const upload = document.getElementById("upload");
upload.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const price = document.getElementById("productPrice").value.trim();
    const desc = document.getElementById("productDesc").value.trim();
    const imageFile = document.getElementById("productImage").files[0];

    if (!name || !price || !desc || !imageFile) {
        alert("Please fill in all product details and select an image.");
        return;
    }
    const user = auth.currentUser;
    if (!user) {
        alert("User not authenticated.");
        return;
    }
    alert("Please wait while we upload your image...");
    const imageRef = ref(storage, `products/${user.uid}/${Date.now()}_${imageFile.name}`);
    try {
        await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(imageRef);
        const product = { name, price, desc, image: imageUrl };
        const productDocRef = doc(collection(db, "products"));
        await setDoc(productDocRef, { ...product, sellerId: user.uid });

        alert("Product added successfully.");
        clearProductForm();
    } catch (error) {
        alert("Error uploading image or saving product.",error);
    }
});
const logout = document.getElementById("logout");
logout.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
        await auth.signOut();
        alert("Logged out successfully.");
        window.location.href = "index.html";
    } catch (error) {
        alert("Error signing out." , error);
    }
});
async function loadProducts() {
    const container = document.getElementById("productsContainer");
    container.innerHTML = "";
    const user = getAuth().currentUser;
    if (!user) return;
    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach(docSnap => {
        const p = docSnap.data();
        if (p.sellerId === user.uid) {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${p.image}" alt="${p.name}" />
                <h4>${p.name}</h4>
                <p>${p.desc}</p>
                <strong>R${p.price}</strong>
            `;
            container.appendChild(card);
        }
    });
}
function clearProductForm() {
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productDesc").value = "";
    document.getElementById("productsContainer").value = "";
}