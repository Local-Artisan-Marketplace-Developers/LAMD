// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDV_AUjMqtpPMy5Yp4Wkwj-mCw9bCOE_-8",
    authDomain: "artisanavenue-13a8d.firebaseapp.com",
    projectId: "artisanavenue-13a8d",
    storageBucket: "artisanavenue-13a8d.appspot.com",
    messagingSenderId: "957096144049",
    appId: "1:957096144049:web:d6c577dc7fec5a3e8b8690",
    measurementId: "G-H2XGRYH35C"
  };
  function toggleForm() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    registerForm.classList.toggle('hidden');
    loginForm.classList.toggle('hidden');
  }
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const Signupsubmit = document.getElementById('Signupsubmit');
  Signupsubmit.addEventListener('click', function(event) {
    event.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        alert("Account created successfully");
        //switch to login form/SignUp form
        toggleForm();
    })
    .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
    });
  });
  const Loginsubmit = document.getElementById('Loginsubmit');
  Loginsubmit.addEventListener('click', function(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        alert("Login successful");
        // Redirect to the home page or perform any other action
        window.location.href = "buyerdashboard3.html";
    })
    .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
    });
  });
  window.toggleForm = toggleForm;