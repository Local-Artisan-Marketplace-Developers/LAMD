document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");

  renderCheckoutSummary();

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const streetNumber = document.getElementById('street-number').value.trim();
      const city = document.getElementById('city').value.trim();
      const postalCode = document.getElementById('postal-code').value.trim();
      const cardNumber = document.getElementById('card-number').value.trim();
      const expiryDate = document.getElementById('expiry-date').value.trim();
      const cvv = document.getElementById('cvv').value.trim();

      if (name && email && cardNumber && expiryDate && cvv) {
        const checkoutCart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
        const orders = JSON.parse(localStorage.getItem("orders")) || [];

        if (checkoutCart.length === 0) {
          alert("Your checkout cart is empty. Cannot proceed with checkout.");
          return;
        }

        const newOrders = checkoutCart.map(item => ({
          ...item,
          status: "Processing",
          buyerName: name,
          buyerEmail: email,
          address: {
            street: streetNumber,
            city: city,
            postalCode: postalCode
          },
          orderDate: new Date().toLocaleString()
        }));

        localStorage.setItem("orders", JSON.stringify([...orders, ...newOrders]));
        localStorage.removeItem("checkoutCart");
        localStorage.removeItem("cartItems");

        alert(`Thank you ${name}! Your payment has been processed and order placed. Confirmation sent to ${email}.`);
        window.location.href = "buyerOrders.html";
      } else {
        alert("Please fill in all required fields.");
      }
    });
  }
});

function renderCheckoutSummary() {
  const checkoutCart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
  const summaryContainer = document.getElementById("checkout-summary");

  if (!summaryContainer) return;

  if (checkoutCart.length === 0) {
    summaryContainer.innerHTML = `<p class="text-gray-500">Your cart is empty.</p>`;
    return;
  }

  let total = 0;
  const itemsHTML = checkoutCart.map(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    return `
      <div class="flex justify-between border-b py-2">
        <div>
          <p class="font-medium">${item.name}</p>
          <p class="text-sm text-gray-600">Qty: ${item.qty}</p>
        </div>
        <p class="text-right font-semibold">R${subtotal.toFixed(2)}</p>
      </div>
    `;
  }).join("");

  summaryContainer.innerHTML = `
    ${itemsHTML}
    <div class="flex justify-between mt-4 pt-4 border-t font-bold text-lg">
      <p>Total</p>
      <p>R${total.toFixed(2)}</p>
    </div>
  `;
}
