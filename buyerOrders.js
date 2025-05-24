let orders = JSON.parse(localStorage.getItem("orders")) || [];

function saveOrders() {
  localStorage.setItem("orders", JSON.stringify(orders));
}

function renderOrders() {
  const container = document.getElementById("orders-container");
  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = `
      <section class="text-center p-6 bg-white rounded shadow">
        <p class="mb-4 text-gray-500">You have no orders yet.</p>
        <a href="buyerupload.html" class="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Browse Products</a>
      </section>`;
    return;
  }

  orders.forEach((order, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-3 border-b">
        <img src="${order.image}" alt="${order.name}" class="h-16 w-16 object-cover rounded">
      </td>
      <td class="p-3 border-b">${order.name}</td>
      <td class="p-3 border-b">R${order.price.toFixed(2)}</td>
      <td class="p-3 border-b ${order.status.toLowerCase() === "delivered" ? "text-green-600" : order.status.toLowerCase() === "shipped" ? "text-blue-500" : "text-gray-500"}">
        ${order.status}
      </td>
      <td class="p-3 border-b">
        <button onclick="removeOrder(${index})" class="text-red-500 hover:text-red-700 text-xl font-bold">&times;</button>
      </td>
    `;
    container.appendChild(row);
  });
}

function removeOrder(index) {
  if (confirm(`Remove order for "${orders[index].name}"?`)) {
    orders.splice(index, 1);
    saveOrders();
    renderOrders();
  }
}

renderOrders();
