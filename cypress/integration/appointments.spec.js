import { CYCLIC_KEY } from "@storybook/addon-actions/dist/constants";



describe('Appointments', () => {

  beforeEach("should visit root", () => {
    cy.request("GET", "/api/debug/reset")
    cy.visit("/");
  });

  it('Should book an interview', () => {
    cy
      .contains("[data-testid=day]", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected")
      .get("[data-testid='add-button2']")
      .first()
      .click()
      .get("[data-testid='student-name-input']")
      .type('Lydia Miller-Jones')
      .get('[alt="Sylvia Palmer"]')
      .click()
      .get('.appointment__actions')
      .contains('Save')
      .click()
      .then(() => {
        cy
          .get(".appointment__actions img:last-of-type")
          .click({ force: true })
          .get('.appointment__actions').contains('Confirm')
          .click()
          .then(() => {
            cy
              .get('.appointment__card.appointment__card--status').contains("Deleting").should('not.exist')
          })
      })
  });

});