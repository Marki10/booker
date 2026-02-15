import { testData } from "../support/testData";

describe("Error Handling", () => {
  beforeEach(() => {
    cy.resetApp();
    cy.visit("/", { failOnStatusCode: false });
    cy.get('[data-testid="booking-list"], [data-testid="booking-calendar"]', {
      timeout: 10000,
    }).should("exist");
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
    // UI should still be functional
    cy.get('[data-testid="booking-list"], [data-testid="booking-calendar"]').should(
      "exist",
    );
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
