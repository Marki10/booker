import { testData } from "../support/testData";

describe("Booking Happy Path", () => {
  const createBookingViaUI = (data: {
    name: string;
    email: string;
    date: string | (() => string);
    time: string;
    duration: string;
    notes?: string;
  }) => {
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
  };

  before(() => {
    cy.resetApp();
    cy.visit("/");
  });

  beforeEach(() => {
    cy.resetApp();
    cy.visit("/");
  });

  after(() => {
    cy.resetApp();
  });

  it("should create a new booking successfully", () => {
    createBookingViaUI({
      name: testData.create.name,
      email: testData.create.email,
      date: testData.create.date,
      time: testData.create.time,
      duration: testData.create.duration,
      notes: testData.create.notes,
    });
    cy.contains('[data-testid="booking-item"]', testData.create.notes).should(
      "be.visible",
    );
  });

  it("should switch between list and calendar views", () => {
    createBookingViaUI({
      name: "View Seed",
      email: "view@example.com",
      date: testData.create.date,
      time: testData.create.time,
      duration: testData.create.duration,
    });
    cy.get('[data-testid="booking-list"]').should("be.visible");
    cy.get('[data-testid="view-mode-calendar"]').click();
    cy.get('[data-testid="booking-calendar"]').should("be.visible");
    cy.get('[data-testid="view-mode-list"]').click();
    cy.get('[data-testid="booking-list"]').should("be.visible");
  });

  it("should edit an existing booking successfully", () => {
    createBookingViaUI({
      name: "Original Title",
      email: "original@example.com",
      date: "2026-12-16",
      time: "14:00",
      duration: "60",
    });
    cy.contains('[data-testid="booking-item"]', 'Original Title')
      .first()
      .within(() => {
        cy.get('[data-testid="edit-booking-button"]').click();
      });
    cy.get('[data-testid="booking-form-name"]')
      .clear()
      .type(testData.update.name);
    cy.get('[data-testid="booking-form-notes"]').type(testData.update.notes);
    cy.get('[data-testid="booking-form-submit"]').click();
    cy.reload();
    cy.contains('[data-testid="booking-item"]', testData.update.name).should(
      "be.visible",
    );
    cy.contains('[data-testid="booking-item"]', testData.update.notes).should(
      "be.visible",
    );
  });

  it("should delete a booking successfully", () => {
    createBookingViaUI({
      name: testData.toDelete.name,
      email: testData.toDelete.email,
      date: testData.toDelete.date,
      time: testData.toDelete.time,
      duration: testData.toDelete.duration,
    });
    cy.get('[data-testid="booking-item"]')
      .first()
      .within(() => {
        cy.get('[data-testid="delete-booking-button"]').click();
      });
    cy.contains('[data-testid="booking-item"]', testData.toDelete.name).should(
      "not.exist",
    );
  });
});
