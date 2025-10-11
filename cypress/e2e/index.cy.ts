describe('/', () => {
  it('has list previews', () => {
    const card = () => cy.get('#list-preview-planets')

    card().should('exist')

    card().contains('Planets of the Solar System')
    card().contains('Name all planets of the solar system in their right order.')
    card().contains('8 items')
    card().contains('Easy')
    card().find('img').should('exist')
    card().find('button').contains("Let's play!")
    card().find('div[data-tip="Mark as favorite"]').find('button').should('exist')
    card().find('div[data-tip="More about the list"]').find('button').should('exist')
  })

  it('has list info popup', () => {
    cy.get('#list-preview-planets')
      .find('div[data-tip="More about the list"]')
      .find('button')
      .eq(0)
      .click()

    const dialog = () => cy.get('dialog').contains('Planets of the Solar System').closest('dialog')

    dialog().should('be.visible')

    dialog().contains('Name all planets of the solar system in their right order.')
    dialog().contains('#universe')
    dialog().contains('Created by FjellOverflow')
    dialog().contains('Last update:')
    dialog().contains('Source')

    dialog().find('div[data-tip="Show raw"]').find('button').click()

    dialog().find('code').contains('Name all planets of the solar system in their right order.')

    dialog().find('div[data-tip="Hide raw"]').find('button').click()

    dialog().find('code').should('not.exist')

    cy.get('#app').click(100, 100)

    dialog().should('not.be.visible')
  })

  it('filters', () => {
    const listCards = () => cy.get('[id^="list-preview-"]')
    listCards().should('have.length.above', 1)

    const stringInput = () => cy.get('input[placeholder="Type to filter"]').first()
    const tagSelect = () => cy.get('select').contains('Tag:').closest('select')
    const sortAttrSelect = () => cy.get('select').contains('Sort by').closest('select')
    const sortDirBtn = () => cy.get('div[data-tip^="Sort"]').find('button')
    const clearBtn = () => cy.get('button').contains('Clear')

    cy.get('.collapse').contains('Filters').parent().parent().find('input[type="checkbox"').click()

    stringInput().type('abc')
    tagSelect().select('Tag: Universe')
    sortAttrSelect().select('Sort by length')
    sortDirBtn().click()

    cy.contains('No lists matching filters.')

    clearBtn().click()

    stringInput().should('have.value', '')
    tagSelect().should('have.value', 'any')
    sortAttrSelect().should('have.value', 'name')

    tagSelect().select('Tag: Universe')
    listCards().should('have.length', 1)

    clearBtn().click()

    stringInput().type('planet')
    listCards().should('have.length', 1)

    clearBtn().click()

    sortAttrSelect().select('Sort by length')
    listCards().first().contains('Planets of the Solar System')
    sortDirBtn().click()
    listCards().last().contains('Planets of the Solar System')
  })

  it('navigates', () => {
    cy.get('#list-preview-planets').find('button').contains("Let's play!").click()

    cy.url().should('contain', '/play/planets')
  })
})

beforeEach(() => {
  cy.window().then((window) => {
    window.localStorage.setItem('completedHelp', 'true')
  })
  cy.visit('/')
})
