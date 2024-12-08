describe('Hello World', () => {
  it('changes language', () => {
    cy.visit('/')

    cy.contains('Hello, world!')

    cy.get('button').click()

    cy.contains('Tere, maailm!')

    cy.get('button').click()

    cy.contains('Hallo, verden!')

    cy.get('button').click()

    cy.contains('Hallo, Welt!')
  })
})
