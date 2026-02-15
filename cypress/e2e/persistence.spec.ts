import { testData } from "../support/testData";

describe("Data Persistence", () => {
  beforeEach(() => {
    cy.resetApp();
    cy.visit("/", { failOnStatusCode: false });
    cy.get('[data-testid="booking-list"], [data-testid="booking-calendar"]', {
      timeout: 10000,
    }).should("exist");
  });

  it("should cancel form creation without saving", () => {
    cy.get('[data-testid="view-mode-list"]').click();
    cy.wait(500);
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="booking-item"]').length > 0) {
        cy.get('[data-testid="booking-item"]').each(() => {
          cy.get('[data-testid="delete-booking-button"]').first().click();
        });
      }
    });
    cy.get('[data-testid="new-booking-button"]').click();
    cy.get('[data-testid="booking-form-name"]').type(testData.cancel.name);
    cy.get('[data-testid="booking-form-email"]').type(testData.cancel.email);
    cy.get('[data-testid="booking-form-cancel"]').click();
    cy.get('[data-testid="booking-form-modal"]').should("not.exist");
    cy.get('[data-testid="empty-booking-list"]', { timeout: 5000 }).should(
      "be.visible",
    );
    cy.contains("No bookings found", { timeout: 5000 }).should("be.visible");
  });
});
