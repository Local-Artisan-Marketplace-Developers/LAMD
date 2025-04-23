/*const stripe = stripe('your-publishable-key');
const elements = stripe.elements();
const card = elements.create('card');
card.mount('#card-element');

document.getElementById('submit').addEventListener('click', async () => {
  const { token, error } = await stripe.createToken(card);
  if (error) {
    console.error(error);
  } else {
    console.log(token);
    // Send token to your server for processing
  }
});*/
document.getElementById('checkout-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const cardNumber = document.getElementById('card-number').value;
  const expiryDate = document.getElementById('expiry-date').value;
  const cvv = document.getElementById('cvv').value;

  // Simulate payment processing
  if (name && cardNumber && expiryDate && cvv) {
    alert(`Processing payment for ${name}...`);
  }
});