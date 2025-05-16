import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { 
  getFirestore, 
  setDoc, 
  getDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA29LZsqcM2tUmNxrtybIOPDqktzcSKGkM",
  authDomain: "lamd-aaf58.firebaseapp.com",
  projectId: "lamd-aaf58",
  storageBucket: "lamd-aaf58.firebasestorage.app",
  messagingSenderId: "791577320367",
  appId: "1:791577320367:web:a053d3cd7d06475e552d5a",
  measurementId: "G-SDSP0S2V04"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Elements
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');

// Toggle between login/register
window.toggleForm = function () {
  registerForm.classList.toggle('hidden');
  loginForm.classList.toggle('hidden');
  messageDiv.textContent = '';
};

// Register with Firebase
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const surname = document.getElementById('regSurname').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name, surname, email, phone
    });

    messageDiv.textContent = "Registration successful!";
    messageDiv.style.color = "green";
    toggleForm();
    setTimeout(() => window.location.href = "AdminDashboard.html", 1500);
  } catch (error) {
    messageDiv.textContent = error.message;
    messageDiv.style.color = "red";
  }
});

// Login with Firebase
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    messageDiv.textContent = "Welcome back!";
    messageDiv.style.color = "green";

    setTimeout(() => window.location.href = "AdminDashboard.html", 1000);
  } catch (error) {
    messageDiv.textContent = "Invalid email or password!";
    messageDiv.style.color = "red";
  }
});

// Google Sign-In
window.handleGoogleLogin = async function () {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user already exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      // Save user data only on first login
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        phone: user.phoneNumber || ""
      });
    }

    messageDiv.textContent = `Welcome, ${user.displayName}! (Google)`;
    messageDiv.style.color = "green";
    setTimeout(() => window.location.href = "AdminDashboard.html", 1000);
  } catch (error) {
    messageDiv.textContent = "Google Sign-In Failed: " + error.message;
    messageDiv.style.color = "red";
  }
};

// Attach to Google buttons
window.onload = function () {
  document.getElementById("googleLoginBtn").addEventListener("click", handleGoogleLogin);
  document.getElementById("googleRegisterBtn").addEventListener("click", handleGoogleLogin);
};

// Keep user logged in
onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname.endsWith("Admin.html")) {
    window.location.href = "AdminDashboard.html";
  }
});
