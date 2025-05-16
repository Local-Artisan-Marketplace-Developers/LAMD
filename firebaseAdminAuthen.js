
// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
  import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js"
  import { getFirestore,setDoc, doc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyA29LZsqcM2tUmNxrtybIOPDqktzcSKGkM",
    authDomain: "lamd-aaf58.firebaseapp.com",
    projectId: "lamd-aaf58",
    storageBucket: "lamd-aaf58.firebasestorage.app",
    messagingSenderId: "791577320367",
    appId: "1:791577320367:web:a053d3cd7d06475e552d5a",
    measurementId: "G-SDSP0S2V04"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  function showMessage(message, divId){
    varmessageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
  }

  const signUp=document.getElementById('submitSignUp');
  signUp.addEventListener('click',(event)=>{
    event.preventDefault();
    const email =document.getElementById('regEmail').value;
    const password=document.getElementById('regPassword').value;
    const name=document.getElementById('regName').value;
    const surname=document.getElementById('regSurname').value;
    const phone=document.getElementById('regPhone').value;

    const auth=getAuth();
    const db=getFirestore();

    createUserWithEmailAndPassword(auth, email,password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            email:email,
            name:name,
            surname:surname,
            phone:phone
        };
        showMessage('Account Created Successfully','signUpMessage');
        const docRef=doc(db,"users",user.uid);
        setDoc(useRef,userData)
        .then(()=>{
            window.location.href='Admin.html';
        })
        .catch((error)=>{
            console.error("error writing document",error);
        });
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use'){
            showMessage('Email Address Already Exists','signUpMessage');
        }
        else{
            showMessage('unable to create User','signUpMessage')
        }
    })
  });
const signIn=document.getElementById('submitSignIn');
  signIp.addEventListener('click',(event)=>{
    event.preventDefault();
    const email =document.getElementById('LoginEmail').value;
    const password=document.getElementById('LoginPassword').value;
    const auth =getAuth();

    signInWithEmailAndPassword(auth, email,password)
    .then((userCredential)=>{
        showMessage('Login is successful','signInMessage')
        const user=userCredential.user;
        localStorage.setItem('loggedInUserId',user.uid);
        window.location.href='AdminDashboard.html';
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/invalid-credential'){
            showMessage('Incorrect Email or Password','signInMessage')
        }
        else{
            showMessage('Account does not exist','signInMessage');
        }
    })    
})
