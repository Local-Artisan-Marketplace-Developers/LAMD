import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

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

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  if (!messageDiv) return;
  messageDiv.style.display = "block";
  messageDiv.textContent = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
    setTimeout(() => { messageDiv.style.display = "none"; }, 500);
  }, 4000);
}

// Toggle between Register and Login forms
window.toggleForm = function () {
  document.getElementById('registerForm').classList.toggle('hidden');
  document.getElementById('loginForm').classList.toggle('hidden');
};

// Handle Sign Up form submit
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const surname = document.getElementById('regSurname').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), { name, surname, email, phone });
    showMessage("Account Created Successfully", "signUpMessage");
    // Redirect after short delay so user sees message
    setTimeout(() => { window.location.href = "AdminDashboard.html"; }, 1500);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      showMessage("Email Address Already Exists", "signUpMessage");
    } else {
      showMessage("Unable to create user: " + error.message, "signUpMessage");
    }
  }
});

// Handle Login form submit
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showMessage("Login successful", "signInMessage");
    setTimeout(() => { window.location.href = "AdminDashboard.html"; }, 1000);
  } catch (error) {
    if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
      showMessage("Incorrect Email or Password", "signInMessage");
    } else {
      showMessage("Login failed: " + error.message, "signInMessage");
    }
  }
});

// Optional: Auth state listener to keep user logged in or redirect
onAuthStateChanged(auth, (user) => {
  if (user) {
    // If user is logged in on Admin.html, send them directly to dashboard
    if (window.location.pathname.endsWith("Admin.html")) {
      window.location.href = "AdminDashboard.html";
    }
  }
});
