// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
  import { getAuth,GoogleAuthProvider ,signInWithCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
  import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
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
  const db = getFirestore(app);
  const Signupsubmit = document.getElementById('Signupsubmit');
  Signupsubmit.addEventListener('click',async(event)=> {
    event.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const name = document.getElementById('regName').value;
    try{
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "buyers", uid), {
        name: name,
        email: email,
        role : "buyer"
      });
      alert("Account created successfully");
      //switch to login form/SignUp form
      toggleForm();
  }
  catch(error) {
        const errorMessage = error.message;
        alert(errorMessage);
    }
  });
  const Loginsubmit = document.getElementById('Loginsubmit');
  Loginsubmit.addEventListener('click', async(event)=> {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try{
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, "buyers", uid));
      if( !userDoc.exists()) {
        alert("No such user found");
        return;
      }
      else{
          alert("Login successful");
          // Redirect to the home page or perform any other action
          window.location.href = "buyerdashboard3.html";
      }
  }
  catch(error) {
        const errorMessage = error.message;
        alert(errorMessage);
  }
});
  // Google Sign-In Callbacks
function handleGoogleLogin(response) {
  
  const credential = GoogleAuthProvider.credential(response.credential);
  
  signInWithCredential(auth, credential)
    .then(async (result) => {
      const user = result.user;
      let role = "buyer";
      await setDoc(doc(db, "buyers", user.uid), {
        name: user.displayName,
        email: user.email,
        role: role
      });
      alert(`Welcome ${user.displayName}!`);
      window.location.href = "buyerdashboard3.html";
    })
    .catch((error) => {
      alert("Google sign-in failed: " + error.message);
    });
}

// Render Google buttons
window.onload = function () {
  google.accounts.id.initialize({
    client_id: "957096144049-8fn1o4ftq9hb5mcfj23jb59sqt6pdst1.apps.googleusercontent.com", 
    callback: handleGoogleLogin
  });

  google.accounts.id.renderButton(
    document.getElementById("googleLoginBtn"),
    { theme: "outline", size: "large", text: "signin_with" }
  );

  google.accounts.id.renderButton(
    document.getElementById("googleRegisterBtn"),
    { theme: "outline", size: "large", text: "signup_with" }
  );
};
window.toggleForm = toggleForm;