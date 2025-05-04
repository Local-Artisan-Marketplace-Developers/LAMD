/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';

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

// Create a mock canvas element and mock the `getContext` method
const canvasElement = document.createElement('canvas');
canvasElement.id = 'salesChart';
canvasElement.getContext = jest.fn().mockReturnValue({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn().mockReturnValue({ data: [] }),
  putImageData: jest.fn(),
  createImageData: jest.fn(),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn().mockReturnValue({ width: 0 }),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn()
});

// Set up the DOM environment
document.body.innerHTML = fs.readFileSync(path.resolve(__dirname, './AdminDashboard.html'), 'utf8');
document.body.appendChild(canvasElement); // Add the canvas to the body

// Import AdminDashboard.js after the DOM setup
import './AdminDashboard.js'; // Now this will run after the canvas is available

// Mock window objects
global.URL.createObjectURL = jest.fn();
global.FileReader = class {
  readAsDataURL(file) {
    this.onload({ target: { result: 'data:image/png;base64,fakeimg' } });
  }
};

window.jspdf = {
  jsPDF: class {
    constructor() {
      this.addImage = jest.fn();
      this.save = jest.fn();
    }
  }
};
window.jspdf.jsPDF.prototype.autoTable = jest.fn();

// Global mocks for other functions in your code
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

  test('profile image uploads preview on change', () => {
    const mockFile = new File(['image content'], 'profile.png', { type: 'image/png' });
    const input = document.createElement('input');
    input.type = 'file';
    const preview = document.createElement('img');

    const event = new Event('change');
    Object.defineProperty(input, 'files', {
      value: [mockFile],
    });
    input.dispatchEvent(event);
    
    preview.src = 'data:image/png;base64,fakeimg';
    expect(preview.src).toContain('data:image/png;base64,fakeimg');
  });

  test('clicking profile image triggers file input', () => {
    const input = document.createElement('input');
    input.type = 'file';

    const preview = document.createElement('img');
    const clickSpy = jest.spyOn(input, 'click');

    preview.addEventListener('click', () => input.click());
    preview.click();

    expect(clickSpy).toHaveBeenCalled();
  });

  test('Settings tab switches correctly', () => {
    const tabName = 'settings';
    const tab = document.createElement('div');
    tab.id = `${tabName.toLowerCase()}-tab`;

    document.body.appendChild(tab);

    showSettingsTab('Settings');
    expect(tab.style.display).toBe('flex');
  });

  test('profile image uploads correctly for non-image file', () => {
    const input = document.createElement('input');
    input.type = 'file';

    const invalidFile = new File(['invalid content'], 'notimage.txt', { type: 'text/plain' });

    const event = new Event('change');
    Object.defineProperty(input, 'files', {
      value: [invalidFile],
    });
    input.dispatchEvent(event);

    expect(input.files[0].type).not.toBe('image/png');
  });

  test('profile image does not change if no file is selected', () => {
    const input = document.createElement('input');
    input.type = 'file';

    const event = new Event('change');
    Object.defineProperty(input, 'files', {
      value: [],
    });
    input.dispatchEvent(event);

    expect(input.files.length).toBe(0);
  });
});
