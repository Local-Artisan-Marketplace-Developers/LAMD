
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  if (form) {
    form.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const streetNumber = document.getElementById('street-number').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postal-code').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;

    // Simulate payment processing
    if (name && email && cardNumber && expiryDate && cvv) {
      alert(`Processing payment for ${name} , confirmation of payment details is sent to ${email}.please proceed to track order page to track your order...`);
      }
    });
  }
});