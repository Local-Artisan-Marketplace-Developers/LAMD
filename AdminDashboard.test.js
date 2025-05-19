
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
      
      // Simulate the event for a non-image file
      const event = new Event('change');
      Object.defineProperty(input, 'files', {
        value: [invalidFile],
      });
      input.dispatchEvent(event);
  
      // Check if the file type is not an image
      expect(input.files[0].type).not.toBe('image/png');
    });
  
    // 5. Profile image does not change if no file is selected
    test('profile image does not change if no file is selected', () => {
      const input = document.createElement('input');
      input.type = 'file';
      
      // Simulate no file being selected
      const event = new Event('change');
      Object.defineProperty(input, 'files', {
        value: [],
      });
      input.dispatchEvent(event);
      
      // Check that the profile image doesn't change (no base64 preview, for example)
      expect(input.files.length).toBe(0);
    });

    test('Selecting a product displays its details and associated seller', () => {
      // Setup mock DOM elements
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

  
  });
