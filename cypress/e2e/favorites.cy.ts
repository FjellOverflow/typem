describe('/favorites', () => {
  it('adds favorite', () => {
    cy.contains('No lists marked favorite yet')

    cy.visit('/')

    const favoriteBtn = () =>
      cy.get('#list-preview-planets').find('div[data-tip="Mark as favorite"]').find('button')

    favoriteBtn().should('not.have.class', 'text-primary')

    favoriteBtn().first().click()

    favoriteBtn().should('have.class', 'text-primary')

    cy.visit('/#/favorites')

    cy.contains('No lists marked favorite yet').should('not.exist')

    cy.get('#list-preview-planets').should('exist')
  })

  it('removes favorite', () => {
    cy.visit('/')

    const favoriteBtn = () =>
      cy.get('#list-preview-planets').find('div[data-tip="Mark as favorite"]').find('button')

    favoriteBtn().first().click()

    cy.visit('/#/favorites')

    favoriteBtn().first().click()

    cy.contains('No lists marked favorite yet').should('exist')

    cy.get('#list-preview-planets').should('not.exist')

    cy.visit('/')

    favoriteBtn().should('not.have.class', 'text-primary')
  })

  it('filters', () => {
    cy.visit('/')
    const listCards = () => cy.get('[id^="list-preview-"]')

    cy.get('#list-preview-planets')
      .find('div[data-tip="Mark as favorite"]')
      .find('button')
      .first()
      .click()
    listCards().eq(0).find('div[data-tip="Mark as favorite"]').find('button').first().click()
    listCards().eq(1).find('div[data-tip="Mark as favorite"]').find('button').first().click()

    cy.visit('/#/favorites')

    listCards().should('have.length', 3)

    const stringInput = () => cy.get('input[placeholder="Type to filter"]').first()
    const tagSelect = () => cy.get('select').contains('Tag:').closest('select')
    const sortAttrSelect = () => cy.get('select').contains('Sort by').closest('select')
    const sortDirBtn = () => cy.get('div[data-tip^="Sort"]').find('button').eq(1)
    const clearBtn = () => cy.get('button').contains('Clear')

    stringInput().type('abc')
    tagSelect().select('Tag: universe')
    sortAttrSelect().select('Sort by length')
    sortDirBtn().click()

    cy.contains('No lists matching filters.')

    clearBtn().click()

    stringInput().should('have.value', '')
    tagSelect().should('have.value', 'any')
    sortAttrSelect().should('have.value', 'name')

    tagSelect().select('Tag: universe')
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
})

beforeEach(() => {
  cy.window().then((window) => {
    window.localStorage.setItem('completedHelp', 'true')
  })
  cy.visit('/#/favorites')
})
