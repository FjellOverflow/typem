describe('ui', () => {
  it('changes theme', () => {
    cy.get('html').should('have.attr', 'data-theme', 'dark')

    cy.get('#themeToggle').click()

    cy.get('html').should('have.attr', 'data-theme', 'light')

    cy.reload()

    cy.get('html').should('have.attr', 'data-theme', 'light')

    cy.get('#themeToggle').click()

    cy.get('html').should('have.attr', 'data-theme', 'dark')
  })

  it('always chooses random list', () => {
    for (let i = 0; i < 10; i++) {
      // eslint-disable-next-line cypress/no-assigning-return-values
      const oldUrl = cy.url()

      cy.get('a').contains('Random').click()

      cy.url().should('contain', '/play/')
      cy.url().should('not.eq', oldUrl)
    }
  })

  it.only('has info pop-up', () => {
    cy.get('#appInfoPopUpBtn').click()

    const dialog = () => cy.get('dialog').contains('typem').closest('dialog')

    dialog().contains('Type out the list items as quickly as possible.')
    dialog().find('a').contains('Homepage')
    dialog().find('a').contains('Report bug')

    dialog().find('a').contains('Settings').click()

    cy.url().should('contain', '/settings')
  })
})

beforeEach(() => {
  cy.window().then((window) => {
    window.localStorage.setItem('completedHelp', 'true')
  })
  cy.visit('/')
})
