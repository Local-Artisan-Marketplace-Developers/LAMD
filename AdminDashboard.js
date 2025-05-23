// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
  import { getAuth,GoogleAuthProvider ,signInWithCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
  import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDV_AUjMqtpPMy5Yp4Wkwj-mCw9bCOE_-8",
    authDomain: "artisanavenue-13a8d.firebaseapp.com",
    projectId: "artisanavenue-13a8d",
    storageBucket: "artisanavenue-13a8d.appspot.com",
    messagingSenderId: "957096144049",
    appId: "1:957096144049:web:d6c577dc7fec5a3e8b8690",
    measurementId: "G-H2XGRYH35C"
  };
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const auth = getAuth(app);
  const users = auth.currentUser;
  const db = getFirestore(app);

const logout = document.getElementById("logout");
logout.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
        await auth.signOut();
        alert("Logged out successfully.");
        window.location.href = "index.html";
    } catch (error) {
        alert("Error signing out." , error);
    }
});
const ctxSales = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(ctxSales, {
  type: 'line',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Sales',
      data: [1200, 1900, 3000, 2500, 2200, 2800, 3200],
      backgroundColor: 'rgba(79, 195, 247, 0.2)',
      borderColor: 'rgba(79, 195, 247, 1)',
      borderWidth: 2,
      fill: true,
      tension: 0.3,
      pointRadius: 5,
      pointHoverRadius: 8
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#fff'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#aaa' },
        grid: { color: '#444' }
      },
      y: {
        ticks: { color: '#aaa' },
        grid: { color: '#444' }
      }
    }
  }
});

const ctxInventory = document.getElementById('inventoryChart').getContext('2d');
const inventoryChart = new Chart(ctxInventory, {
  type: 'bar',
  data: {
    labels: ['Product 1', 'Product 2', 'Product 3', 'Product 4', 'Product 5'],
    datasets: [{
      label: 'Stock Level',
      data: [120, 85, 200, 50, 150],
      backgroundColor: 'rgba(0, 150, 136, 0.6)',
      borderColor: 'rgba(0, 150, 136, 1)',
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#fff'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#aaa' },
        grid: { color: '#444' }
      },
      y: {
        ticks: { color: '#aaa' },
        grid: { color: '#444' }
      }
    }
  }
});

function exportChartToPDF(chartId) {
  const chartCanvas = document.getElementById(chartId);
  const chartImg = chartCanvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.addImage(chartImg, 'PNG', 15, 15, 180, 160);
  doc.save(`${chartId}_Report.pdf`);
}
function exportChartToCSV(chartId) {
  const chart = chartId === 'salesChart' ? salesChart : inventoryChart;
  const data = chart.data.datasets[0].data;
  const labels = chart.data.labels;
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Date,Value\n";
  labels.forEach((label, index) => {
    csvContent += `${label},${data[index]}\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${chartId}_Report.csv`);
  link.click();
}
function exportTableToCSV() {
  const rows = document.querySelectorAll("#customReportTable tr");
  let csvContent = "data:text/csv;charset=utf-8,";

  rows.forEach(row => {
    const columns = row.querySelectorAll("td, th");
    const rowData = Array.from(columns).map(column => column.textContent);
    csvContent += rowData.join(",") + "\n";
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Custom_Report.csv");
  link.click();
}
function exportTableToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const table = document.getElementById('customReportTable');
  doc.autoTable({ html: table });
  doc.save('Custom_Report.pdf');
}
document.querySelectorAll('aside nav a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const sectionText = this.textContent.trim().toLowerCase();
      const targetId = sectionText + 'Section';
      document.querySelectorAll('main > section').forEach(section => {
        section.hidden = section.id !== targetId;
      });
      document.querySelectorAll('aside nav a').forEach(a => a.classList.remove('active'));
      this.classList.add('active');
    });
  });
  function logout() {
    alert('Logged out! Redirecting to login page...');
    window.location.href = '/login';
  }
  document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('profilePicUpload');
    const profilePreview = document.getElementById('profilePreview');
  
    fileInput.addEventListener('change', function () {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          profilePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  
    profilePreview.addEventListener('click', () => {
      fileInput.click();
    });
  });  
  function showSettingsTab(tabId) {
    const tabs = ['General', 'AdminAccount'];
    tabs.forEach(id => {
      const section = document.getElementById(id);
      if (section) section.style.display = (id === tabId) ? 'flex' : 'none';
    });
  }

  // --- Existing code above remains unchanged ---

// Mock seller data (replace with real fetch or Firebase calls)
const sellers = [
  {
    email: 'yonwaba@gmail.com',
    products: [
      { name: 'Product A', price: 'R100' },
      { name: 'Product B', price: 'R200' }
    ]
  },
  {
    email: 'yamkela@gmail.com',
    products: [
      { name: 'Product C', price: 'R300' }
    ]
  },
  {
    email: 'njabulo@gmail.com',
    products: [
      { name: 'Product D', price: 'R150' },
      { name: 'Product E', price: 'R250' },
      { name: 'Product F', price: 'R350' }
    ]
  },
  {
    email: 'katleho@gmail.com',
    products: []
  }
];

// Render sellers into the reviewSellerSection table
function renderSellerList() {
  const tbody = document.getElementById('sellerListBody');
  tbody.innerHTML = ''; // clear previous rows

  sellers.forEach((seller, index) => {
    const tr = document.createElement('tr');

    // Seller Email
    const emailTd = document.createElement('td');
    emailTd.textContent = seller.email;
    tr.appendChild(emailTd);

    // Products List
    const productsTd = document.createElement('td');
    if (seller.products.length > 0) {
      const ul = document.createElement('ul');
      seller.products.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.name} - ${p.price}`;
        ul.appendChild(li);
      });
      productsTd.appendChild(ul);
    } else {
      productsTd.textContent = 'No products listed';
    }
    tr.appendChild(productsTd);

    // Actions
    const actionsTd = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Seller';
    deleteBtn.classList.add('deleteSellerBtn');
    deleteBtn.addEventListener('click', () => {
      if (confirm(`Are you sure you want to delete seller ${seller.email}?`)) {
        deleteSeller(index);
      }
    });
    actionsTd.appendChild(deleteBtn);
    tr.appendChild(actionsTd);

    tbody.appendChild(tr);
  });
}

// Delete seller by index (update data source accordingly)
function deleteSeller(index) {
  // For now, just remove from array and rerender
  sellers.splice(index, 1);
  renderSellerList();
  alert('Seller deleted successfully.');
}

// Navigation to show/hide sections including Review Seller
document.querySelectorAll('aside nav a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    // Remove active class from all nav links and add to clicked one
    document.querySelectorAll('aside nav a').forEach(a => a.classList.remove('active'));
    this.classList.add('active');

    // Hide all main sections
    const sections = ['dashboardSection', 'usersSection', 'ordersSection', 'reportsSection', 'settingsSection', 'reviewSellerSection'];
    sections.forEach(id => {
      const sec = document.getElementById(id);
      if (sec) sec.hidden = true;
    });

    // Show the correct section based on nav text
    const text = this.textContent.trim();
    switch(text) {
      case 'Dashboard':
        document.getElementById('dashboardSection').hidden = false;
        break;
      case 'Users':
        document.getElementById('usersSection').hidden = false;
        break;
      case 'Orders':
        document.getElementById('ordersSection').hidden = false;
        break;
      case 'Reports':
        document.getElementById('reportsSection').hidden = false;
        break;
      case 'Settings':
        document.getElementById('settingsSection').hidden = false;
        break;
      case 'Review Seller':
        document.getElementById('reviewSellerSection').hidden = false;
        renderSellerList(); // load seller list
        break;
    }
  });
});


