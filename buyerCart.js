/* ================  DATA  ================ */
let cart = JSON.parse(localStorage.getItem("cart"))     || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

/* ================  HELPERS  ================ */
const saveCart   = () => localStorage.setItem("cart"  , JSON.stringify(cart));
const saveOrders = () => localStorage.setItem("orders", JSON.stringify(orders));

/* ================  RENDER CART  ================ */
function renderCart() {
  const tbody   = document.getElementById("cart-body");
  const summary = document.getElementById("cart-summary");
  tbody.innerHTML = "";

  /* Empty cart UI */
  if (cart.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="p-6 text-center text-gray-500">
          Your cart is empty. 
          <a href="index.html" class="ml-2 text-teal-600 underline hover:text-teal-800">Continue shopping</a>
        </td>
      </tr>`;
    summary.innerHTML = "";
    return;
  }

  /* Rows + running total */
  let total = 0;

  cart.forEach((item, idx) => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    const row      = document.createElement("tr");
    row.innerHTML  = `
      <td class="p-3 border-b">
        <img src="${item.image}" alt="${item.name}" class="h-16 w-16 object-cover rounded">
      </td>
      <td class="p-3 border-b">${item.name}</td>
      <td class="p-3 border-b">R${item.price.toFixed(2)}</td>
      <td class="p-3 border-b">
        <input type="number" min="1" value="${item.qty}" 
               class="w-16 text-center border rounded"
               onchange="updateQty(${idx}, this.value)">
      </td>
      <td class="p-3 border-b">R${subtotal.toFixed(2)}</td>
      <td class="p-3 border-b">
        <button onclick="removeItem(${idx})"
                class="text-red-500 hover:text-red-700 text-xl font-bold">&times;</button>
      </td>`;
    tbody.appendChild(row);
  });

  /* Summary section */
  summary.innerHTML = `
    <div class="bg-white rounded shadow p-4 flex justify-between items-center">
      <p class="text-lg font-semibold">Total: R${total.toFixed(2)}</p>
      <button onclick="checkout()"
              class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded">
        Checkout
      </button>
    </div>`;
}

/* ================  ACTIONS  ================ */
function updateQty(index, newQty) {
  const qty = Math.max(1, parseInt(newQty) || 1);
  cart[index].qty = qty;
  saveCart();
  renderCart();
}

function removeItem(index) {
  if (confirm(`Remove "${cart[index].name}" from cart?`)) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
  }
}

function checkout() {
  if (!confirm("Place order for all items in cart?")) return;

  /* Move each cart item to orders */
  cart.forEach(item => {
    orders.push({
      name  : item.name,
      image : item.image,
      price : item.price * item.qty,
      status: "Processing"
    });
  });

  /* Clear cart */
  cart = [];
  saveCart();
  saveOrders();
  renderCart();
  alert("Thank you! Your order has been placed.");
}

/* ================  INITIAL DATA SEED  (demo) ================ */
if (cart.length === 0) {
  cart.push({
    name : "Handmade Soap",
    image: "https://via.placeholder.com/100",
    price: 50.00,
    qty  : 2
  });
  cart.push({
    name : "Organic Lotion",
    image: "https://via.placeholder.com/100",
    price: 90.00,
    qty  : 1
  });
  saveCart();
}

/* ================  KICK OFF  ================ */
renderCart();
