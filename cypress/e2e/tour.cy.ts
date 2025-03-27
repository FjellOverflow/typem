describe('tour', () => {
  it('starts tour on first visit', () => {
    cy.visit('/')

    cy.get('dialog').contains('Welcome to Typem!').should('exist')

    cy.get('dialog').contains('Skip').click()

    cy.get('dialog').contains('Welcome to Typem!').should('not.exist')

    cy.reload()

    cy.get('dialog').contains('Welcome to Typem!').should('not.exist')
  })

  it('opens tour', () => {
    cy.window().then((window) => {
      window.localStorage.setItem('completedHelp', 'true')
    })

    cy.visit('/')

    cy.get('#openHelpBtn').click()

    cy.get('dialog').contains('Welcome to Typem!').should('exist')

    cy.get('dialog').contains('Skip').click()

    cy.get('dialog').contains('Welcome to Typem!').should('not.exist')
  })

  const tourPopup = () => cy.get('dialog').find('.shepherd-content')

  it('can do tour by clicking "Next"', () => {
    cy.visit('/')

    cy.get('dialog').contains('Welcome to Typem!').should('exist')

    tourPopup().contains('Start the tour').click()

    tourPopup().contains('Explore Lists').parent().parent().find('button').contains('Next').click()
    tourPopup()
      .contains('Your First Round')
      .parent()
      .parent()
      .find('button')
      .contains('Next')
      .click()
    tourPopup().contains('The Game View').parent().parent().find('button').contains('Next').click()
    tourPopup().contains('Customization').parent().parent().find('button').contains('Next').click()
    tourPopup().contains('Ready to Play').parent().parent().find('button').contains('Next').click()
    cy.get('#inputField').type('Mercury')
    cy.get('#inputField').type('Venus')
    tourPopup().contains('Running timer').parent().parent().find('button').contains('Next').click()
    tourPopup().contains('Game Over').parent().parent().find('button').contains('Next').click()
    tourPopup().contains('Game Review').parent().parent().find('button').contains('Next').click()
    tourPopup()
      .contains('Track Your Progress')
      .parent()
      .parent()
      .find('button')
      .contains('Next')
      .click()

    tourPopup()
      .contains("You're All Set!")
      .parent()
      .parent()
      .find('button')
      .contains('Finish the tour')
      .click()

    cy.reload()

    cy.get('dialog').contains('Welcome to Typem!').should('not.exist')
  })

  it('can do tour by interacting with UI', () => {
    cy.visit('/')

    cy.get('dialog').contains('Welcome to Typem!').should('exist')

    tourPopup().contains('Start the tour').click()

    tourPopup().contains('Explore Lists').parent().parent().find('button').contains('Next').click()

    cy.get('#list-preview-planets').find('button').contains("Let's play!").click({ force: true })

    tourPopup().contains('The Game View').parent().parent().find('button').contains('Next').click()
    tourPopup().contains('Customization').parent().parent().find('button').contains('Next').click()

    cy.get('#list-preview-planets').find('button').contains("I'm ready!").click({ force: true })

    cy.get('#inputField').type('Mercury')
    cy.get('#inputField').type('Venus')

    cy.get('#timerCard').find('button').contains('Give up').click({ force: true })

    tourPopup().contains('Game Over').parent().parent().find('button').contains('Next').click()
    tourPopup().contains('Game Review').parent().parent().find('button').contains('Next').click()
    tourPopup()
      .contains('Track Your Progress')
      .parent()
      .parent()
      .find('button')
      .contains('Next')
      .click()

    tourPopup()
      .contains("You're All Set!")
      .parent()
      .parent()
      .find('button')
      .contains('Finish the tour')
      .click()

    cy.reload()

    cy.get('dialog').contains('Welcome to Typem!').should('not.exist')
  })
})
