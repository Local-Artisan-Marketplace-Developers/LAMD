import {
    formatPrice,
    getStatusClass,
    loadFromStorage,
    saveToStorage
  } from "./dashboardUtil.js";
  
  describe("Utility Functions", () => {
    beforeEach(() => {
      localStorage.clear();
    });
  
    test("formatPrice returns R-currency string with 2 decimals", () => {
      expect(formatPrice(65)).toBe("R65.00");
      expect(formatPrice(19.5)).toBe("R19.50");
    });
  
    test("getStatusClass returns correct class based on status", () => {
      expect(getStatusClass("Delivered")).toBe("text-green-600");
      expect(getStatusClass("Shipped")).toBe("text-blue-500");
      expect(getStatusClass("Pending")).toBe("text-gray-500");
    });
  
    test("saveToStorage and loadFromStorage correctly store and retrieve data", () => {
      const data = [{ name: "Honey", price: 120 }];
      saveToStorage("testKey", data);
      const loaded = loadFromStorage("testKey");
      expect(loaded).toEqual(data);
    });
  
    test("loadFromStorage returns empty array when key is missing", () => {
      const result = loadFromStorage("nonexistentKey");
      expect(result).toEqual([]);
    });
  });
  
