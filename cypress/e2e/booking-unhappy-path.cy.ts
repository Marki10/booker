import { testData } from "../support/testData";

describe("Booking Unhappy Path", () => {
  beforeEach(() => {
    cy.resetApp();
    cy.visit("/");
  });

  it("should show validation errors for empty required fields", () => {
    cy.get('[data-testid="new-booking-button"]').click();
    cy.get('[data-testid="booking-form-modal"]').should("be.visible");
    cy.get('[data-testid="booking-form-submit"]').click();

    cy.contains(
      '[data-testid="booking-form-email-error"]',
      "Please enter a valid email address",
    ).should("be.visible");
    cy.get('[data-testid="booking-form-modal"]').should("be.visible");
  });

  it("should show error for choosing a past date", () => {
    cy.get('[data-testid="new-booking-button"]').click();
    cy.get('[data-testid="booking-form-name"]').type("Past Date Test");
    cy.get('[data-testid="booking-form-email"]').type("user@example.com");
    const iso = testData.pastDate();
    cy.get('[data-testid="booking-form-date"]').then(($input) => {
      // For type="date", programmatic set + events is most reliable
      const input = $input[0] as HTMLInputElement;
      input.value = iso;
      $input.trigger("input");
      $input.trigger("change");
      $input.blur();
    });
    cy.get('[data-testid="booking-form-submit"]').click();
    cy.get('[data-testid="booking-form-date-error"]').should("be.visible");
    cy.get('[data-testid="booking-form-modal"]').should("be.visible");
  });

  it("should handle sync failure without crashing the UI", () => {
    cy.intercept("GET", "http://localhost:3000/health", { statusCode: 200 }).as(
      "health",
    );
    cy.intercept("GET", "http://localhost:3000/api/bookings", {
      statusCode: 500,
      body: { error: "Server error" },
    }).as("bookings");
    cy.get('[data-testid="sync-button"]').click();
    cy.wait(["@health", "@bookings"]);
    cy.get('[data-testid="sync-status"]').should("not.exist");
  });

  it("should cancel form creation without saving", () => {
    cy.get('[data-testid="new-booking-button"]').click();
    cy.get('[data-testid="booking-form-name"]').type(testData.cancel.name);
    cy.get('[data-testid="booking-form-email"]').type(testData.cancel.email);
    cy.get('[data-testid="booking-form-cancel"]').click();
    cy.get('[data-testid="booking-form-modal"]').should("not.exist");
    cy.contains("No bookings found").should("be.visible");
  });

  it("should keep local booking when backend create fails", () => {
    cy.intercept("POST", "http://localhost:3000/api/bookings", {
      statusCode: 400,
      body: { error: "Invalid booking data" },
    }).as("createBookingFailure");
    cy.get('[data-testid="new-booking-button"]').click();
    cy.get('[data-testid="booking-form-name"]').type(testData.apiError.name);
    cy.get('[data-testid="booking-form-email"]').type(testData.apiError.email);
    cy.get('[data-testid="booking-form-date"]').type(testData.apiError.date());
    cy.get('[data-testid="booking-form-time"]').select(testData.apiError.time);
    cy.get('[data-testid="booking-form-duration"]').select(
      testData.apiError.duration,
    );
    cy.get('[data-testid="booking-form-submit"]').click();
    cy.get('[data-testid="booking-list"]').should("be.visible");
    cy.get('[data-testid="booking-item"]').should(
      "contain",
      testData.apiError.name,
    );
  });
});
