describe('/play basic functionality', () => {
  it('has components', () => {
    const card = () => cy.get('#list-preview-planets')

    card().should('exist')

    card().contains('Planets of the Solar System')
    card().contains('Name all planets of the solar system in their right order.')
    card().contains('8 items')
    card().contains('Easy')
    card().find('img').should('exist')
    card().find('button').contains("I'm ready!")
    card().find('div[data-tip="Mark as favorite"]').find('button').should('exist')
    card().find('div[data-tip="More about the list"]').find('button').should('exist')

    cy.get('#itemsCard').should('exist')
    cy.get('#settingsCard').should('exist')
    cy.get('#itemsCard').find('li').first().should('not.include.text', 'Mercury')
  })

  it('starts game', () => {
    cy.get('#list-preview-planets').find('button').contains("I'm ready!").click()

    cy.get('#settingsCard').find('input').should('be.disabled')

    cy.get('#timerCard').find('button').contains('Start').should('exist')
    cy.get('#timerCard').find('button').contains('Stop').should('not.exist')
    cy.get('#timerCard').find('button').contains('Pause').should('not.exist')
    cy.get('#timerCard').find('button').contains('Give up').should('not.exist')

    cy.get('#inputField').should('not.be.disabled')
    cy.get('#itemsCard').find('li').first().should('not.include.text', 'Mercury')
  })

  it('pauses and resumes game', () => {
    cy.get('#settingsCard').contains('Allow pauses').click()

    cy.get('#list-preview-planets').find('button').contains("I'm ready!").click()

    cy.get('#timerCard').find('button').contains('Start').click()

    cy.get('#timerCard').find('button').contains('Stop').should('not.exist')
    cy.get('#timerCard').find('button').contains('Give up').should('not.exist')

    cy.get('#timerCard').find('button').contains('Pause').click()
    cy.get('#settingsCard').find('input').should('be.disabled')

    cy.get('#timerCard').find('button').contains('Resume').should('exist')
    cy.get('#timerCard').find('button').contains('Give up').should('exist')

    cy.get('#timerCard').find('button').contains('Resume').click()

    cy.get('#timerCard').find('button').contains('Stop').should('not.exist')
    cy.get('#timerCard').find('button').contains('Give up').should('not.exist')
  })

  it('stops game', () => {
    cy.get('#list-preview-planets').find('button').contains("I'm ready!").click()
    cy.get('#timerCard').find('button').contains('Start').click()

    cy.get('#timerCard').find('button').contains('Give up').click()

    cy.get('#timerCard').find('button').should('not.exist')

    cy.get('#inputField').should('be.disabled')
    cy.get('#itemsCard').find('li').first().should('include.text', 'Mercury')
  })

  it('resets game', () => {
    cy.get('#list-preview-planets').find('button').contains("I'm ready!").click()
    cy.get('#timerCard').find('button').contains('Start').click()

    cy.get('#timerCard').find('button').contains('Give up').click()

    cy.get('#list-preview-planets').find('button').contains('Restart').click()

    cy.get('#list-preview-planets').find('button').contains("I'm ready!").should('exist')

    cy.get('#settingsCard').find('input').should('not.be.disabled')
    cy.get('#inputField').should('not.exist')
    cy.get('#timerCard').should('not.exist')

    cy.get('#itemsCard').find('li').first().should('not.include.text', 'Mercury')
  })
})

beforeEach(() => {
  cy.window().then((window) => {
    window.localStorage.setItem('completedHelp', 'true')
  })
  cy.visit('/#/play/planets')
})
