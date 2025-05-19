document.addEventListener("DOMContentLoaded", () => {
    renderOrders();
  });
  
  function renderOrders() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const ordersContainer = document.getElementById("orders-container");
  
    if (!ordersContainer) return;
  
    if (orders.length === 0) {
      ordersContainer.innerHTML = `<p class="text-gray-500">No orders found. Start shopping and checkout to place orders.</p>`;
      return;
    }
  
    const orderCards = orders.map((order, index) => `
      <div class="order-card border p-4 mb-4 rounded shadow">
        <h3 class="font-bold text-lg mb-2">Order #${index + 1}</h3>
        <p><strong>Item:</strong> ${order.name}</p>
        <p><strong>Quantity:</strong> ${order.qty}</p>
        <p><strong>Price:</strong> R${order.price.toFixed(2)}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Order Date:</strong> ${order.orderDate}</p>
        <div class="mt-2">
          <p><strong>Buyer:</strong> ${order.buyerName}</p>
          <p><strong>Email:</strong> ${order.buyerEmail}</p>
          <p><strong>Address:</strong> ${order.address.street}, ${order.address.city}, ${order.address.postalCode}</p>
        </div>
      </div>
    `).join("");
  
    ordersContainer.innerHTML = orderCards;
  }
  
