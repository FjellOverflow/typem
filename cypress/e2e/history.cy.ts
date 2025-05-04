describe('/history', () => {
  it('adds playthrough', () => {
    cy.contains('No playthroughs yet').should('exist')

    cy.visit('/#/play/planets')
    cy.get('button').contains("I'm ready!").click()
    cy.get('#inputField').type('mercury')
    cy.get('#timerCard').find('button').contains('Give up').click()

    cy.visit('/#/history')

    cy.get('.playthrough-card').contains('Planets of the Solar System').should('exist')
  })

  it('has all data', () => {
    cy.window().then((window) => {
      window.localStorage.setItem(
        'history',
        JSON.stringify([
          {
            listId: 'planets',
            seconds: 8,
            finished: true,
            numberOfMatches: 1,
            timestamp: new Date().toISOString(),
          },
        ]),
      )
    })
    cy.reload()

    cy.get('.playthrough-card').contains('Record').should('exist')
    cy.get('.playthrough-card').contains('Finished').should('exist')
    cy.get('.playthrough-card').contains('8.0 sec').should('exist')
    cy.get('.playthrough-card').contains('8.00 sec/item').should('exist')
    cy.get('.playthrough-card').contains(new Date().toLocaleDateString()).should('exist')
  })

  it("doesn't add playthrough with no matches", () => {
    cy.contains('No playthroughs yet').should('exist')
    cy.visit('/#/play/planets')
    cy.get('button').contains("I'm ready!").click()
    cy.get('#inputField').type('m')
    cy.get('#timerCard').find('button').contains('Give up').click()

    cy.visit('/#/history')

    cy.contains('No playthroughs yet').should('exist')
    cy.get('.playthrough-card').should('not.exist')
  })

  it('removes playthrough', () => {
    cy.window().then((window) => {
      window.localStorage.setItem(
        'history',
        JSON.stringify([
          {
            listId: 'planets',
            seconds: 8,
            finished: true,
            numberOfMatches: 1,
            timestamp: new Date().toISOString(),
          },
        ]),
      )
    })
    cy.reload()

    cy.get('.playthrough-card').find('div[data-tip="Delete playthrough"]').find('button').click()
    cy.get('dialog').find('button').contains('Cancel').click()

    cy.contains('No playthroughs yet').should('not.exist')
    cy.get('.playthrough-card').should('exist')

    cy.get('.playthrough-card').find('div[data-tip="Delete playthrough"]').find('button').click()
    cy.get('dialog').find('button').contains('Confirm').click()

    cy.contains('No playthroughs yet').should('exist')
    cy.get('.playthrough-card').should('not.exist')
  })

  it('navigates to list', () => {
    cy.window().then((window) => {
      window.localStorage.setItem(
        'history',
        JSON.stringify([
          {
            listId: 'planets',
            seconds: 8,
            finished: true,
            numberOfMatches: 1,
            timestamp: new Date().toISOString(),
          },
        ]),
      )
    })
    cy.reload()

    cy.get('.playthrough-card').find('a').contains('Planets of the Solar System').click()

    cy.url().should('contain', '/play/planets')
  })

  it('shows all, finished and records', () => {
    cy.window().then((window) => {
      window.localStorage.setItem(
        'history',
        JSON.stringify([
          {
            listId: 'planets',
            seconds: 7,
            finished: false,
            numberOfMatches: 1,
            timestamp: new Date().toISOString(),
          },
          {
            listId: 'planets',
            seconds: 9,
            finished: true,
            numberOfMatches: 8,
            timestamp: new Date(new Date().setMinutes(-1)).toISOString(),
          },
          {
            listId: 'planets',
            seconds: 8,
            finished: true,
            numberOfMatches: 8,
            timestamp: new Date(new Date().setMinutes(-2)).toISOString(),
          },
        ]),
      )
    })
    cy.reload()

    cy.visit('/#/history/all')

    cy.get('.playthrough-card').should('have.length', 3)
    cy.get('.playthrough-card').contains('Record').should('exist')
    cy.get('.playthrough-card').contains('Finished').should('exist')
    cy.get('.playthrough-card').contains('Matched 1/8').should('exist')

    cy.visit('/#/history/finished')

    cy.get('.playthrough-card').should('have.length', 2)
    cy.get('.playthrough-card').contains('Record').should('exist')
    cy.get('.playthrough-card').contains('Finished').should('exist')
    cy.get('.playthrough-card').contains('Matched 1/8').should('not.exist')

    cy.visit('/#/history/records')

    cy.get('.playthrough-card').should('have.length', 1)
    cy.get('.playthrough-card').contains('Record').should('exist')
    cy.get('.playthrough-card').contains('Finished').should('exist')
    cy.get('.playthrough-card').contains('Matched 1/8').should('not.exist')
  })

  it('filters', () => {
    cy.window().then((window) => {
      window.localStorage.setItem(
        'history',
        JSON.stringify([
          {
            listId: 'planets',
            seconds: 7,
            finished: false,
            numberOfMatches: 1,
            timestamp: new Date().toISOString(),
          },
          {
            listId: 'planets',
            seconds: 9,
            finished: true,
            numberOfMatches: 8,
            timestamp: new Date(new Date().setMinutes(-1)).toISOString(),
          },
          {
            listId: 'planets',
            seconds: 8,
            finished: true,
            numberOfMatches: 8,
            timestamp: new Date(new Date().setMinutes(-2)).toISOString(),
          },
        ]),
      )
    })
    cy.reload()

    cy.get('select').contains('Sort by').closest('select').select('Sort by date')
    cy.get('.playthrough-card').first().contains('Matched 1/8').should('exist')
    cy.get('.playthrough-card').eq(1).contains('Finished').should('exist')
    cy.get('.playthrough-card').last().contains('Record').should('exist')

    cy.get('select').contains('Sort by').closest('select').select('Sort by speed')
    cy.get('.playthrough-card').first().contains('Record').should('exist')
    cy.get('.playthrough-card').eq(1).contains('Finished').should('exist')
    cy.get('.playthrough-card').last().contains('Matched 1/8').should('exist')

    cy.get('select').contains('Sort by').closest('select').select('Sort by duration')
    cy.get('.playthrough-card').first().contains('Matched 1/8').should('exist')
    cy.get('.playthrough-card').eq(1).contains('Record').should('exist')
    cy.get('.playthrough-card').last().contains('Finished').should('exist')

    cy.get('div[data-tip^="Sort"]').find('button').eq(1).click()

    cy.get('select').contains('Sort by').closest('select').select('Sort by date')
    cy.get('.playthrough-card').first().contains('Record').should('exist')
    cy.get('.playthrough-card').eq(1).contains('Finished').should('exist')
    cy.get('.playthrough-card').last().contains('Matched 1/8').should('exist')

    cy.get('select').contains('Sort by').closest('select').select('Sort by speed')
    cy.get('.playthrough-card').first().contains('Matched 1/8').should('exist')
    cy.get('.playthrough-card').eq(1).contains('Finished').should('exist')
    cy.get('.playthrough-card').last().contains('Record').should('exist')

    cy.get('select').contains('Sort by').closest('select').select('Sort by duration')
    cy.get('.playthrough-card').first().contains('Finished').should('exist')
    cy.get('.playthrough-card').eq(1).contains('Record').should('exist')
    cy.get('.playthrough-card').last().contains('Matched 1/8').should('exist')

    cy.get('select').contains('All lists').closest('select').select('African Capitals')

    cy.contains('No playthroughs yet.')

    cy.get('select').contains('All lists').closest('select').select('Planets of the Solar System')
    cy.get('.playthrough-card').should('have.length', 3)

    cy.get('button').contains('Clear').click()

    cy.get('select').contains('All lists').should('have.value', '')
    cy.get('select').contains('Sort by').should('have.value', 'date')
  })
})

beforeEach(() => {
  cy.window().then((window) => {
    window.localStorage.setItem('completedHelp', 'true')
  })
  cy.visit('/#/history')
})
