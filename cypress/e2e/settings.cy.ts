import { generateTimestampStr } from '../../src/plugins/util.ts'

describe('/settings', () => {
  const historyCard = () =>
    cy.get('div').contains('All past playthroughs played.').parent().parent().parent()

  it('resets history', () => {
    cy.window().then((window) => {
      window.localStorage.setItem(
        'history',
        JSON.stringify([
          {
            listId: 'planets',
            seconds: 1,
            finished: true,
            numberOfMatches: 1,
            timestamp: new Date().toISOString(),
          },
          {
            listId: 'planets',
            seconds: 2,
            finished: true,
            numberOfMatches: 1,
            timestamp: new Date().toISOString(),
          },
        ]),
      )
    })

    historyCard().find('button').contains('Reset').click()
    cy.get('dialog').find('button').contains('Confirm').click()

    cy.visit('/#/history')

    cy.contains('No playthroughs yet').should('exist')
  })

  it('imports history', () => {
    historyCard().find('button').contains('Import from JSON').click()
    const dialog = () => cy.get('dialog').contains('Overwrite history?').parentsUntil('dialog')

    dialog()
      .find('input[type="file"]')
      .selectFile(
        Cypress.Buffer.from(
          JSON.stringify([
            {
              listId: 'planets',
              seconds: 7,
              finished: false,
              numberOfMatches: 1,
              timestamp: new Date().toISOString(),
            },
          ]),
        ),
      )

    dialog().find('button').contains('Upload').click()

    cy.visit('/#/history')
    cy.contains('No playthroughs yet').should('not.exist')
    cy.get('.playthrough-card').contains('Planets of the Solar System').should('exist')
  })

  it('exports history', () => {
    const mockedHistory = [
      {
        listId: 'planets',
        seconds: 1,
        finished: true,
        numberOfMatches: 1,
        timestamp: new Date().toISOString(),
      },
      {
        listId: 'planets',
        seconds: 2,
        finished: true,
        numberOfMatches: 1,
        timestamp: new Date().toISOString(),
      },
    ]

    cy.window().then((window) => {
      window.localStorage.setItem('history', JSON.stringify(mockedHistory))
    })

    historyCard().find('button').contains('Export all').click()

    let filename = `cypress/downloads/typem_history_${generateTimestampStr()}.json`

    cy.readFile(filename).then((fileContent) => {
      expect(JSON.stringify(fileContent)).to.equal(JSON.stringify(mockedHistory))
    })

    historyCard().find('button').contains('Export records only').click()

    filename = `cypress/downloads/typem_records_${generateTimestampStr()}.json`

    cy.readFile(filename).then((fileContent) => {
      expect(JSON.stringify(fileContent)).to.equal(JSON.stringify([mockedHistory[0]]))
    })
  })

  it('imports custom list', () => {
    cy.get('div')
      .contains('Custom lists')
      .parent()
      .parent()
      .parent()
      .find('button')
      .contains('Import from JSON')
      .click()

    const dialog = () => cy.get('dialog').contains('Import custom list').parentsUntil('dialog')

    dialog()
      .find('input[type="file"]')
      .selectFile(
        Cypress.Buffer.from(
          JSON.stringify({
            id: 'our-planet',
            meta: {
              name: 'Our planet',
              description: 'Name our planet',
              difficulty: 1,
              tags: ['universe'],
              category: 'universe',
              source: 'https://en.wikipedia.org/wiki/Solar_System',
              author: 'FjellOverflow',
              lastUpdated: '2025-03-25',
            },
            items: [
              {
                answer: 'Earth',
                matches: ['Earth'],
              },
            ],
            settings: {
              requireWhitespaces: false,
              requireCapitalization: false,
              requireOrder: true,
              numberOfPauses: 0,
              showHints: false,
              allowOverride: true,
            },
          }),
        ),
      )

    dialog().find('button').contains('Upload').click()
    cy.visit('/')
    const card = () => cy.get('#list-preview-custom-our-planet')

    card().contains('Our planet').should('exist')
    card().contains('Name our planet').should('exist')
    card().contains('1 items').should('exist')
    card().contains('Easy').should('exist')
    card().contains('Custom').should('exist')
  })
})

beforeEach(() => {
  cy.window().then((window) => {
    window.localStorage.setItem('completedHelp', 'true')
  })
  cy.visit('/#/settings')
})
