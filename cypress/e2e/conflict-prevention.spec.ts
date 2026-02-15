import { testData } from "../support/testData";

describe("Conflict Prevention", () => {
  beforeEach(() => {
    cy.resetApp();
    cy.visit("/", { failOnStatusCode: false });
    cy.get(
      '[data-testid="booking-list"], [data-testid="booking-calendar"], [data-testid="empty-booking-list"]',
      {
      timeout: 10000,
      },
    ).should("exist");
  });

  it("should prevent double booking of the same time slot", () => {
    const bookingData = {
      name: "First Booking",
      email: "first@example.com",
      date: testData.create.date,
      time: testData.create.time,
      duration: testData.create.duration,
    };
    cy.get('[data-testid="new-booking-button"]').click();
    cy.get('[data-testid="booking-form-modal"]').should("be.visible");
    cy.get('[data-testid="booking-form-name"]').type(bookingData.name);
    cy.get('[data-testid="booking-form-email"]').type(bookingData.email);
    const dateValue =
      typeof bookingData.date === "function"
        ? bookingData.date()
        : bookingData.date;
    cy.get('[data-testid="booking-form-date"]').type(dateValue);
    cy.get('[data-testid="booking-form-time"]').select(bookingData.time);
    cy.get('[data-testid="booking-form-duration"]').select(
      bookingData.duration,
    );
    cy.get('[data-testid="booking-form-submit"]').click();
    cy.get('[data-testid="booking-list"]').should("be.visible");
    cy.get('[data-testid="new-booking-button"]').click();
    cy.get('[data-testid="booking-form-modal"]').should("be.visible");
    cy.get('[data-testid="booking-form-name"]').type("Conflicting Booking");
    cy.get('[data-testid="booking-form-email"]').type("conflict@example.com");
    cy.get('[data-testid="booking-form-date"]').type(dateValue);
    cy.get('[data-testid="booking-form-time"]').select(bookingData.time);
    cy.get('[data-testid="booking-form-duration"]').select(
      bookingData.duration,
    );
    cy.get('[data-testid="booking-form-submit"]').click();
    cy.get('[data-testid="booking-form-time-error"]', {
      timeout: 5000,
    }).should("be.visible");
    cy.contains("already booked").should("be.visible");
  });
});
