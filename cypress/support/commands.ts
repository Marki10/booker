export {};

declare global {
  namespace Cypress {
    interface Chainable {
      resetApp(): Chainable<void>;
      createBooking(data: {
        name: string;
        email: string;
        date: string | (() => string);
        time: string;
        duration: string;
        notes?: string;
      }): Chainable<void>;
      editBooking(originalTitle: string, updates: Partial<{
        name: string;
        email: string;
        date: string | (() => string);
        time: string;
        duration: string;
        notes: string;
      }>): Chainable<void>;
    }
  }
}

// Clear app storage before tests
Cypress.Commands.add("resetApp", () => {
  cy.window({ log: false }).then((win) => {
    try {
      win.localStorage.removeItem("booker_bookings");
      win.localStorage.removeItem("booker_sync_meta");
      win.localStorage.clear();
      win.localStorage.setItem("booker_bookings", JSON.stringify([]));
      win.localStorage.setItem(
        "booker_sync_meta",
        JSON.stringify({ lastSync: null, pendingSync: false }),
      );
    } catch {}
  });
});

// Create a booking via UI
Cypress.Commands.add("createBooking", (data) => {
  const dateValue = typeof data.date === "function" ? data.date() : data.date;
  cy.get('[data-testid="new-booking-button"]').click();
  cy.get('[data-testid="booking-form-modal"]').should("be.visible");
  cy.get('[data-testid="booking-form-name"]').type(data.name);
  cy.get('[data-testid="booking-form-email"]').type(data.email);
  cy.get('[data-testid="booking-form-date"]').type(dateValue);
  cy.get('[data-testid="booking-form-time"]').select(data.time);
  cy.get('[data-testid="booking-form-duration"]').select(data.duration);
  if (data.notes) {
    cy.get('[data-testid="booking-form-notes"]').type(data.notes);
  }
  cy.get('[data-testid="booking-form-submit"]').click();
  cy.get('[data-testid="booking-list"]').should("be.visible");
  cy.contains('[data-testid="booking-item"]', data.name).should("be.visible");
});

// Edit a booking identified by its current title
Cypress.Commands.add("editBooking", (originalTitle, updates) => {
  cy.contains('[data-testid="booking-item"]', originalTitle)
    .first()
    .within(() => {
      cy.get('[data-testid="edit-booking-button"]').click();
    });

  if (updates.name) {
    cy.get('[data-testid="booking-form-name"]').clear().type(updates.name);
  }
  if (updates.email) {
    cy.get('[data-testid="booking-form-email"]').clear().type(updates.email);
  }
  if (updates.date) {
    const dateValue = typeof updates.date === "function" ? updates.date() : updates.date;
    cy.get('[data-testid="booking-form-date"]').clear().type(dateValue);
  }
  if (updates.time) {
    cy.get('[data-testid="booking-form-time"]').select(updates.time);
  }
  if (updates.duration) {
    cy.get('[data-testid="booking-form-duration"]').select(updates.duration);
  }
  if (updates.notes) {
    cy.get('[data-testid="booking-form-notes"]').clear().type(updates.notes);
  }

  cy.get('[data-testid="booking-form-submit"]').click();
});
