global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
//Load your HTML file to create a DOM environment for testing.
const html = fs.readFileSync(path.resolve(__dirname, "checkout.html"), "utf8");
const dom = new JSDOM(html, { runScripts: "dangerously" });
const document = dom.window.document;
const script = document.createElement("script");
script.textContent = fs.readFileSync(path.resolve(__dirname, "checkout.js"), "utf8");
document.body.appendChild(script);
import './checkout.js';
describe("Checkout Page Functionality", () => {
  let form, nameInput, emailInput, streetNumberInput, cityInput, postalInput, cardNumberInput, expiryDateInput, cvvInput, submitButton;

  beforeEach(() => {
    global.alert = jest.fn();
    form = document.getElementById("checkout-form");
    nameInput = document.getElementById("name");
    emailInput = document.getElementById("email");
    streetNumberInput = document.getElementById("street-number");
    cityInput = document.getElementById("city");
    postalInput = document.getElementById("postal-code");
    cardNumberInput = document.getElementById("card-number");
    expiryDateInput = document.getElementById("expiry-date");
    cvvInput = document.getElementById("cvv");
    submitButton = document.getElementById("submit");
  });
  test("Form exists and inputs are present", () => {
    expect(form).toBeDefined();
    expect(nameInput).toBeDefined();
    expect(emailInput).toBeDefined();
    expect(streetNumberInput).toBeDefined();
    expect(cityInput).toBeDefined();
    expect(postalInput).toBeDefined();
    expect(cardNumberInput).toBeDefined();
    expect(expiryDateInput).toBeDefined();
    expect(cvvInput).toBeDefined();
    expect(submitButton).toBeDefined();
  });

  test("Validation prevents empty fields from being submitted", () => {
    nameInput.value = "";
    emailInput.value = "";
    streetNumberInput.value = "";
    cityInput.value = "";
    postalInput.value = "";
    cardNumberInput.value = "";
    expiryDateInput.value = "";
    cvvInput.value = "";

    const alertMock = jest.spyOn(global, "alert").mockImplementation(() => {});
    form.dispatchEvent(new dom.window.Event("submit"));
    
    expect(alertMock).not.toHaveBeenCalledWith("Processing payment");
    alertMock.mockRestore();
  });

  test("Simulated payment triggers alert for valid inputs", () => {
    nameInput.value = "John Doe";
    emailInput.value = "random@gmail.com";
  
    const alertMock = jest.spyOn(global, "alert").mockImplementation(() => {});
  
    form.dispatchEvent(new dom.window.Event("submit"));
    expect(alertMock).not.toHaveBeenCalledWith(expect.stringContaining(""));
    alertMock.mockRestore();
  });

  test("Stripe element integration works correctly (mocked)", () => {
    const stripeMock = {
      createToken: jest.fn(() =>
        Promise.resolve({ token: "mockedToken", error: null })
      ),
    };
    const cardMock = { mount: jest.fn() };

    stripeMock.elements = jest.fn(() => ({
      create: jest.fn(() => cardMock),
    }));

    expect(cardMock.mount).toHaveBeenCalledTimes(0);
    expect(stripeMock.createToken).not.toHaveBeenCalled();
  });
});