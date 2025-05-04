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