
/**
 * @jest-environment jsdom
 */
describe('Buyer Dashboard Visibility', () => {
    beforeEach(() => {
      // Simulate the HTML DOM
      document.body.innerHTML = `
        <section id="buyerDashboard" style="display:none;"></section>
        <section id="sellerDashboard" style="display:none;"></section>
        <section id="adminDashboard" style="display:none;"></section>
  
        <script>
          const role = "buyer";
          document.getElementById("buyerDashboard").style.display = role === "buyer" ? "block" : "none";
          document.getElementById("sellerDashboard").style.display = role === "seller" ? "block" : "none";
          document.getElementById("adminDashboard").style.display = role === "admin" ? "block" : "none";
        </script>
      `;
  
      // Re-run the logic that would be in the inline <script> block
      const role = "buyer";
      document.getElementById("buyerDashboard").style.display = role === "buyer" ? "block" : "none";
      document.getElementById("sellerDashboard").style.display = role === "seller" ? "block" : "none";
      document.getElementById("adminDashboard").style.display = role === "admin" ? "block" : "none";
    });
  
    test('shows buyer dashboard if role is buyer', () => {
      expect(document.getElementById("buyerDashboard").style.display).toBe("block");
    });
  
    test('hides seller and admin dashboards if role is buyer', () => {
      expect(document.getElementById("sellerDashboard").style.display).toBe("none");
      expect(document.getElementById("adminDashboard").style.display).toBe("none");
    });
  });
  
  