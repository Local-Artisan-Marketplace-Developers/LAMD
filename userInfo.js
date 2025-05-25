import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth,setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js"; 
import { getFirestore, doc, setDoc, getDocs, collection,deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-storage.js";
window.addEventListener("DOMContentLoaded", async () => {

const firebaseConfig = {
    apiKey: "AIzaSyDV_AUjMqtpPMy5Yp4Wkwj-mCw9bCOE_-8",
    authDomain: "artisanavenue-13a8d.firebaseapp.com",
    projectId: "artisanavenue-13a8d",
    storageBucket: "artisanavenue-13a8d.appspot.com",
    messagingSenderId: "957096144049",
    appId: "1:957096144049:web:d6c577dc7fec5a3e8b8690",
    measurementId: "G-H2XGRYH35C"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const users = auth.currentUser;
const db = getFirestore(app); 
const buyerInfo = document.getElementById("buyerInfo");
const querySnapshot = await getDocs(collection(db, "buyers"));
    querySnapshot.forEach(docSnap => {
        const p = docSnap.data();
        buyerInfo.innerHTML +=`
            <p>Name: ${p.name}    |    Email: ${p.email}</p>
        `;  
    });
const sellerInfo = document.getElementById("sellerInfo");
const querySnapshots = await getDocs(collection(db, "sellers"));
    querySnapshots.forEach(docSnap => {
        const p = docSnap.data();
        sellerInfo.innerHTML +=`
            <p>Name: ${p.name}    |    Email: ${p.email}</p>
        `;  
    });
});
