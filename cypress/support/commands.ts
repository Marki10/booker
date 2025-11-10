export {};

declare global {
  namespace Cypress {
    interface Chainable {
      resetApp(): Chainable<void>;
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
