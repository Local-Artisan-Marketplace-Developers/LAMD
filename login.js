const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');

function toggleForm() {
  registerForm.classList.toggle('hidden');
  loginForm.classList.toggle('hidden');
  messageDiv.textContent = '';
}

// Register locally
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const surname = document.getElementById('regSurname').value;
  const email = document.getElementById('regEmail').value;
  const phone = document.getElementById('regPhone').value;
  const password = document.getElementById('regPassword').value;

  if (localStorage.getItem(email)) {
    messageDiv.textContent = 'User already exists!';
    messageDiv.style.color = 'red';
  } else {
    const userData = { name, surname, email, phone, password };
    localStorage.setItem(email, JSON.stringify(userData));
    messageDiv.textContent = 'Registration successful!';
    messageDiv.style.color = 'green';
    toggleForm();
  }
});

// Login locally
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const storedUser = JSON.parse(localStorage.getItem(email));
  if (storedUser && storedUser.password === password) {
    messageDiv.textContent = `Welcome back, ${storedUser.name}!`;
    messageDiv.style.color = 'green';
  } else {
    messageDiv.textContent = 'Invalid email or password!';
    messageDiv.style.color = 'red';
  }
});

// Google Sign-In Callbacks
function handleGoogleLogin(response) {
  const userObject = jwtDecode(response.credential);
  messageDiv.textContent = `Welcome, ${userObject.name}! (Google Sign-In)`;
  messageDiv.style.color = 'green';
  console.log("Google User:", userObject);
}

// Render Google buttons
window.onload = function () {
  google.accounts.id.initialize({
    client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with your client ID
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
