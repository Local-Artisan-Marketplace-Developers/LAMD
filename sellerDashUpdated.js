window.onload = () => {
    displayStore();
    loadProducts();
};

document.getElementById("registerBtn").addEventListener("click", () => {
    const name = document.getElementById("storeName").value.trim();
    const desc = document.getElementById("storeDesc").value.trim();

    if (!name || !desc) {
        alert("Please fill out store name and description.");
        return;
    }

    const store = { name, desc };
    localStorage.setItem("sellerStore", JSON.stringify(store));
    displayStore();

    const addProducts = confirm("Store registered successfully! Do you want to add products now?");
    if (addProducts) {
        document.getElementById("productSection").style.display = "block";
        document.getElementById("productList").style.display = "block";
        document.getElementById("reviews").style.display = "block";
    } else {
        document.getElementById("productSection").style.display = "none";
        document.getElementById("productList").style.display = "block";
        document.getElementById("reviews").style.display = "block";
    }
});

function displayStore() {
    const store = JSON.parse(localStorage.getItem("sellerStore"));
    const display = document.getElementById("storeDisplay");
    if (store) {
        display.innerHTML = `<h4>${store.name}</h4><p>${store.desc}</p>`;
        document.getElementById("productList").style.display = "block";
        document.getElementById("reviews").style.display = "block";
    }
}

function addProduct() {
    const name = document.getElementById("productName").value.trim();
    const price = document.getElementById("productPrice").value.trim();
    const desc = document.getElementById("productDesc").value.trim();
    const imageInput = document.getElementById("productImage");

    if (!name || !price || !desc || !imageInput.files[0]) {
        alert("Please fill in all product details and select an image.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const imageData = e.target.result;
        const product = { name, price, desc, image: imageData };

        const products = JSON.parse(localStorage.getItem("products")) || [];
        products.push(product);
        localStorage.setItem("products", JSON.stringify(products));
        loadProducts();
        clearProductForm();
    };
    reader.readAsDataURL(imageInput.files[0]);
}

function loadProducts() {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const container = document.getElementById("productsContainer");
    container.innerHTML = "";

    products.forEach((p, index) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}" />
            <h4>${p.name}</h4>
            <p>${p.desc}</p>
            <strong>R${p.price}</strong>
            <br/>
            <button onclick="removeProduct(${index})" class="bg-teal-500 hover:bg-teal-600 text-white font-bold px-4 py-2 rounded mr-2">Remove</button>
            <button onclick="editProduct(${index})" class="bg-teal-500 hover:bg-teal-600 text-white font-bold px-4 py-2 rounded">Edit</button>
            <button class="save-btn" onclick="saveProductChanges(${index})" style="display: none;">Save Changes</button>
        `;
        container.appendChild(card);
    });
}

function removeProduct(index) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    loadProducts();
}

function editProduct(index) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products[index];

    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productDesc").value = product.desc;
    document.getElementById("productImage").value = ""; // Keep it empty for now, as image editing is more complex

    // Hide Add Product and Show Save Changes Button
    const saveBtn = document.querySelectorAll(".save-btn")[index];
    saveBtn.style.display = "inline-block";
    saveBtn.onclick = () => saveProductChanges(index);
}

function saveProductChanges(index) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const name = document.getElementById("productName").value.trim();
    const price = document.getElementById("productPrice").value.trim();
    const desc = document.getElementById("productDesc").value.trim();
    const imageInput = document.getElementById("productImage");

    if (!name || !price || !desc) {
        alert("Please fill in all product details.");
        return;
    }

    const updatedProduct = { name, price, desc, image: imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : products[index].image };

    products[index] = updatedProduct;
    localStorage.setItem("products", JSON.stringify(products));
    loadProducts();
    clearProductForm();
}

function clearProductForm() {
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productDesc").value = "";
    document.getElementById("productImage").value = "";
}
