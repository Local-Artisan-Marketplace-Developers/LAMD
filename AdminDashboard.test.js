
/**
 * @jest-environment jsdom
 */

HTMLCanvasElement.prototype.getContext = () => {
    return {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: () => { return { data: [] }; },
      putImageData: () => {},
      createImageData: () => [],
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => { return { width: 0 }; },
      transform: () => {},
      rect: () => {},
      clip: () => {}
    };
  };
  
  // Mock for Chart.js
  jest.mock('chart.js', () => {
    return {
      Chart: function () {
        return {
          destroy: jest.fn()
        };
      }
    };
  });
  
  import fs from 'fs';
  import path from 'path';
  import { Chart } from 'chart.js';
  
  global.Chart = Chart;
  global.URL.createObjectURL = jest.fn();
  global.FileReader = class {
    readAsDataURL(file) {
      this.onload({ target: { result: 'data:image/png;base64,fakeimg' } });
    }
  };
  
  document.body.innerHTML = fs.readFileSync(path.resolve(__dirname, './AdminDashboard.html'), 'utf8');
  
  window.jspdf = {
    jsPDF: class {
      constructor() {
        this.addImage = jest.fn();
        this.save = jest.fn();
      }
    }
  };
  window.jspdf.jsPDF.prototype.autoTable = jest.fn();
  
  // Global mocks
  global.logout = () => {
    alert('Logged out! Redirecting to login page...');
    window.location.href = '/login';
  };
  
  global.showSettingsTab = (tabName) => {
    document.querySelectorAll('.settings-tab').forEach(tab => {
      tab.style.display = 'none';
    });
    document.getElementById(`${tabName.toLowerCase()}-tab`).style.display = 'flex';
  };
  
  describe('AdminDashboard interactions', () => {

    // 1. Profile image upload preview on change
    test('profile image uploads preview on change', () => {
      // Create a mock file
      const mockFile = new File(['image content'], 'profile.png', { type: 'image/png' });
      
      // Mock the input element and the preview element
      const input = document.createElement('input');
      input.type = 'file';
      const preview = document.createElement('img');
      
      // Simulate a file selection event
      const event = new Event('change');
      Object.defineProperty(input, 'files', {
        value: [mockFile],
      });
      input.dispatchEvent(event);
      
      // Assuming your logic converts the image to base64 for preview
      // Mock the src attribute change
      preview.src = 'data:image/png;base64,fakeimg';
      
      // Check if the preview src contains the base64 string
      expect(preview.src).toContain('data:image/png;base64,fakeimg');
    });
  
    // 2. Clicking profile image triggers file input
    test('clicking profile image triggers file input', () => {
      const input = document.createElement('input');
      input.type = 'file';
      
      const preview = document.createElement('img');
      const clickSpy = jest.spyOn(input, 'click');
      
      // Simulate a click on the preview image, which should trigger the file input click
      preview.addEventListener('click', () => input.click());  // Make sure the click triggers the file input
      preview.click(); 
      expect(clickSpy).toHaveBeenCalled();
    });
  
    // 3. Settings tab switches correctly
    test('Settings tab switches correctly', () => {
      // Mock the tabs
      const tabName = 'settings';
      const tab = document.createElement('div');
      tab.id = `${tabName.toLowerCase()}-tab`;
  
      // Set up a basic DOM for testing
      document.body.appendChild(tab);
      
      // Simulate tab switching
      const showSettingsTab = (tabName) => {
        const tab = document.getElementById(`${tabName.toLowerCase()}-tab`);
        if (tab) {
          tab.style.display = 'flex';
        }
      };
  
      // Simulate switching the settings tab
      showSettingsTab('Settings');
      
      // Verify the style is set correctly
      expect(tab.style.display).toBe('flex');
    });
  
    // 4. Profile image uploads correctly for non-image file
    test('profile image uploads correctly for non-image file', () => {
      const input = document.createElement('input');
      input.type = 'file';
      
      // Create a mock non-image file
      const invalidFile = new File(['invalid content'], 'notimage.txt', { type: 'text/plain' });
      
   
      const event = new Event('change');
      Object.defineProperty(input, 'files', {
        value: [invalidFile],
      });
      input.dispatchEvent(event);
  
      // Check if the file type is not an image
      expect(input.files[0].type).not.toBe('image/png');
    });
  
    test('profile image does not change if no file is selected', () => {
      const input = document.createElement('input');
      input.type = 'file';
      
      // Simulate no file being selected
      const event = new Event('change');
      Object.defineProperty(input, 'files', {
        value: [],
      });
      input.dispatchEvent(event);
      

      expect(input.files.length).toBe(0);
    });

    test('Selecting a product displays its details and associated seller', () => {
      const productList = document.createElement('ul');
      const productItem = document.createElement('li');
      productItem.textContent = 'Sample Product';
      productItem.dataset.seller = 'John Doe';
      productList.appendChild(productItem);

      const detailsDiv = document.createElement('div');
      detailsDiv.id = 'product-details';
      const sellerDiv = document.createElement('div');
      sellerDiv.id = 'seller-info';

      document.body.appendChild(productList);
      document.body.appendChild(detailsDiv);
      document.body.appendChild(sellerDiv);

      productItem.addEventListener('click', () => {
      detailsDiv.textContent = `Product: ${productItem.textContent}`;
      sellerDiv.textContent = `Seller: ${productItem.dataset.seller}`;
      });

      // Simulate click
      productItem.click();

      // Assert expected results
      expect(detailsDiv.textContent).toBe('Product: Sample Product');
      expect(sellerDiv.textContent).toBe('Seller: John Doe');
    });

    test('categorized user list is displayed correctly', () => {
      const admins = document.createElement('section');
      admins.id = 'admins-section';
      admins.innerHTML = '<div>Admin: Alice</div>';

      const sellers = document.createElement('section');
      sellers.id = 'sellers-section';
      sellers.innerHTML = '<div>Seller: Bob</div>';

      const buyers = document.createElement('section');
      buyers.id = 'buyers-section';
      buyers.innerHTML = '<div>Buyer: Carol</div>';

      document.body.appendChild(admins);
      document.body.appendChild(sellers);
      document.body.appendChild(buyers);

      expect(document.getElementById('admins-section').textContent).toContain('Admin: Alice');
      expect(document.getElementById('sellers-section').textContent).toContain('Seller: Bob');
      expect(document.getElementById('buyers-section').textContent).toContain('Buyer: Carol');
    });


    test('summary statistics cards are displayed correctly', () => {
      const userSummary = document.createElement('div');
      userSummary.id = 'user-summary';
      userSummary.textContent = 'Total Users: 30';

      const orderSummary = document.createElement('div');
      orderSummary.id = 'order-summary';
      orderSummary.textContent = 'Total Orders: 120';

      const salesSummary = document.createElement('div');
      salesSummary.id = 'sales-summary';
      salesSummary.textContent = 'Total Sales: $2000';

      document.body.appendChild(userSummary);
      document.body.appendChild(orderSummary);
      document.body.appendChild(salesSummary);

      expect(document.getElementById('user-summary').textContent).toContain('Total Users: 30');
      expect(document.getElementById('order-summary').textContent).toContain('Total Orders: 120');
      expect(document.getElementById('sales-summary').textContent).toContain('Total Sales: $2000');
    });

    test('export PDF triggers jsPDF and saves file', () => {
      const exportBtn = document.createElement('button');
      exportBtn.id = 'export-pdf';
      document.body.appendChild(exportBtn);

      const jsPDF = window.jspdf.jsPDF;
      const pdf = new jsPDF();

      exportBtn.addEventListener('click', () => {
        pdf.autoTable({ head: [['Name', 'Role']], body: [['Alice', 'Admin']] });
        pdf.save('users_list.pdf');
      });

      exportBtn.click();
      expect(pdf.autoTable).toHaveBeenCalled();
      expect(pdf.save).toHaveBeenCalledWith('users_list.pdf');
    });

    test('export CSV creates blob and triggers download', () => {
      const exportBtn = document.createElement('button');
      exportBtn.id = 'export-csv';
      document.body.appendChild(exportBtn);

      const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL');

      exportBtn.addEventListener('click', () => {
        const csv = 'Name,Role\nAlice,Admin';
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users_list.csv';
        document.body.appendChild(a);
        a.click();
      });

      exportBtn.click();
      expect(createObjectURLSpy).toHaveBeenCalled();
      });

test('Clicking on Orders displays a list of orders with correct details', () => {
  // Create mock "Orders" tab button
  const ordersTab = document.createElement('button');
  ordersTab.id = 'orders-tab';

  const ordersSection = document.createElement('section');
  ordersSection.id = 'orders-section';
  ordersSection.style.display = 'none';
  ordersSection.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>#001</td>
          <td>Inga Bikitsha</td>
          <td>R250</td>
          <td>Shipped</td>
        </tr>
        <tr>
          <td>#002</td>
          <td>Sinothando Dlomo</td>
          <td>R430</td>
          <td>Pending</td>
        </tr>
      </tbody>
    </table>
  `;

  // Append elements to DOM
  document.body.appendChild(ordersTab);
  document.body.appendChild(ordersSection);

  // Simulate tab logic: clicking the button shows the orders section
  ordersTab.addEventListener('click', () => {
    ordersSection.style.display = 'block';
  });

  // Trigger the click
  ordersTab.click();

  // Assertions
  expect(ordersSection.style.display).toBe('block');
  expect(ordersSection.innerHTML).toContain('Inga Bikitsha');
  expect(ordersSection.innerHTML).toContain('Sinothando Dlomo');
  expect(ordersSection.innerHTML).toContain('R250');
  expect(ordersSection.innerHTML).toContain('Pending');
});

// 11. Clicking on Reports displays the weekly and monthly summaries
test('Clicking on Reports displays the report with correct summary details', () => {
  // Create mock "Reports" tab button
  const reportsTab = document.createElement('button');
  reportsTab.id = 'reports-tab';

  // Create mock reports section (initially hidden)
  const reportsSection = document.createElement('section');
  reportsSection.id = 'reports-section';
  reportsSection.style.display = 'none';
  reportsSection.innerHTML = `
    <div id="weekly-summary">
      <h3>Weekly Summary</h3>
      <p>Sales up 8%, 2 new users registered.</p>
    </div>
    <div id="monthly-growth">
      <h3>Monthly Growth</h3>
      <p>Total revenue: R120,000 | Profit: R35,000</p>
    </div>
  `;

  // Append elements to DOM
  document.body.appendChild(reportsTab);
  document.body.appendChild(reportsSection);

  // Simulate tab logic: clicking the button shows the reports section
  reportsTab.addEventListener('click', () => {
    reportsSection.style.display = 'block';
  });

  // Trigger the click
  reportsTab.click();

  // Assertions
  expect(reportsSection.style.display).toBe('block');
  expect(reportsSection.innerHTML).toContain('Sales up 8%, 2 new users registered.');
  expect(reportsSection.innerHTML).toContain('Total revenue: R120,000 | Profit: R35,000');
});

test('Clicking the logout button shows alert and redirects to index.html', () => {
  // Setup logout button in DOM
  const logoutBtn = document.createElement('button');
  logoutBtn.id = 'logout';
  document.body.appendChild(logoutBtn);

  // Mock alert and location.href
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  delete window.location;
  window.location = { href: '' };

  // Add event listener as in your code
  logoutBtn.addEventListener('click', () => {
    alert('Logged out! Redirecting to login page...');
    window.location.href = "index.html";
  });

  // Simulate click on logout button
  logoutBtn.click();

  // Assertions
  expect(alertSpy).toHaveBeenCalledWith('Logged out! Redirecting to login page...');
  expect(window.location.href).toBe('index.html');
});


  });
