describe("Navigation", () => {
  before("should visit root", () => {
    cy.visit("/");
  });

  it('Should click on Tuesday and book an interview, then delete it', () => {

      cy
      .contains("[data-testid=day]", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected")
      .get("[data-testid='add-button2']")
      .first()
      .click()
      .get("[data-testid='student-name-input']")
      .type('juni')
      .get('.interviewers__list li:first-of-type')
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

  it('Should click on Tuesday and book an interview, then edit the interview, then delete it', () => {

    cy
    .contains("[data-testid=day]", "Tuesday")
    .click()
    .should("have.class", "day-list__item--selected")
    .get("[data-testid='add-button2']")
    .first()
    .click()
    .get("[data-testid='student-name-input']")
    .type('Gray')
    .get('.interviewers__list li:first-of-type')
    .click()
    .get('.appointment__actions')
    .contains('Save')
    .click()
    .then(() => {
      cy
        .get(".appointment__actions img:first-of-type")
        .click({ force: true })
        .get("[data-testid='student-name-input']")
        .clear()
        .type('Coleton')
        .get('.appointment__actions')
        .contains('Save')
        .click()
        .then(() => {
          cy
            .get(".appointment__actions img:last-of-type")
            .click({ force: true })
            .get('.appointment__actions').contains('Confirm')
            .click()
        })
    })

  });

  // });

  // it('Should cancel an interview', () => {

  // });

});