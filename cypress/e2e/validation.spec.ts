import { testData } from "../support/testData";

describe("Form Validation", () => {
  beforeEach(() => {
    cy.resetApp();
    cy.visit("/", { failOnStatusCode: false });
    cy.get('[data-testid="booking-list"], [data-testid="booking-calendar"]', {
      timeout: 10000,
    }).should("exist");
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
});
