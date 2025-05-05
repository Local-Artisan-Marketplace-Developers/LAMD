/**
 * @jest-environment jsdom
 */
import {
  addToCart,
  removeFromWishlist,
  removeOrder,
  wishlist,
  orders,
  cart
} from "./buyerdashboard3.js";

beforeEach(() => {
  localStorage.clear();
  wishlist.length = 0;
  orders.length = 0;
  cart.length = 0;

  wishlist.push({
    name: "Test Fig",
    image: "test.png",
    price: 50,
    available: true
  });

  orders.push({
    name: "Test Order",
    image: "test.png",
    price: 100,
    status: "Shipped"
  });
}

);

describe("buyerdashboard3.js", () => {
  test("addToCart() should move item from wishlist to cart", () => {
    addToCart(0);
    expect(wishlist.length).toBe(0);
    expect(cart.length).toBe(1);
    expect(cart[0].name).toBe("Test Fig");
  });

  test("removeFromWishlist() should remove item from wishlist", () => {
    window.confirm = jest.fn(() => true);
    removeFromWishlist(0);
    expect(wishlist.length).toBe(0);
  });

  test("removeOrder() should remove an order", () => {
    window.confirm = jest.fn(() => true);
    removeOrder(0);
    expect(orders.length).toBe(0);
  });
});
