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

describe('/play settings', () => {
  const startGame = () => {
    cy.get('#list-preview-planets').find('button').contains("I'm ready!").click()
    cy.get('#timerCard').find('button').contains('Start').click()
  }

  const resetGame = () => {
    cy.get('#timerCard').find('button').contains('Give up').click()
    cy.get('#list-preview-planets').find('button').contains('Restart').click()
    cy.get('#settingsCard').children().first().click()
  }

  it('respects number of pauses', () => {
    const pauseAndResume = () => {
      cy.get('#timerCard').find('button').contains('Pause').click()
      cy.get('#timerCard').find('button').contains('Resume').click()
    }

    const setPauses = (i: number) => {
      cy.get('label')
        .contains('Allow pauses')
        .parent()
        .find('input')
        .then((checkbox) => {
          if (!checkbox.is(':checked')) {
            cy.get('label').contains('Allow pauses').click()
          }
        })
      cy.get('input[type="range"]').invoke('val', i).trigger('input')
    }

    startGame()

    cy.get('#timerCard').find('button').contains('Pause').should('be.disabled')

    const pauseNtimes = (n: number) => {
      resetGame()
      setPauses(n)
      startGame()

      for (let i = 0; i < n; i++) {
        pauseAndResume()
      }
    }

    pauseNtimes(1)
    cy.get('#timerCard').find('button').contains('Pause').should('be.disabled')

    pauseNtimes(2)
    cy.get('#timerCard').find('button').contains('Pause').should('be.disabled')

    pauseNtimes(3)
    cy.get('#timerCard').find('button').contains('Pause').should('be.disabled')

    pauseNtimes(4)
    cy.get('#timerCard').find('button').contains('Pause').should('be.disabled')

    pauseNtimes(5)
    cy.get('#timerCard').find('button').contains('Pause').should('be.disabled')

    resetGame()
    cy.get('input[type="range"]').invoke('val', 6).trigger('input')
    startGame()
    for (let i = 0; i < 7; i++) {
      pauseAndResume()
    }
    cy.get('#timerCard').find('button').contains('Pause').should('not.be.disabled')
  })

  it('shows hints', () => {
    startGame()
    cy.get('div').contains('1st planet').should('not.exist')

    resetGame()

    cy.get('#settingsCard').contains('Show hints').click()

    startGame()
    cy.get('div').contains('1st planet').should('exist')
  })

  it('shuffles', () => {
    cy.get('#settingsCard').contains('Shuffle items').click()

    startGame()
    cy.get('#timerCard').find('button').contains('Give up').click()

    // 0.2% chance first three items are in correct order when shuffled
    cy.get('#itemsCard')
      .find('li')
      .first()
      .invoke('text')
      .then((text) => {
        if (text.includes('Mercury')) {
          cy.get('#itemsCard')
            .find('li')
            .eq(1)
            .invoke('text')
            .then((text) => {
              if (text.includes('Venus')) {
                cy.get('#itemsCard').find('li').eq(1).contains('Earth').should('not.exist')
              }
            })
        }
      })

    cy.get('#list-preview-planets').find('button').contains('Restart').click()

    cy.get('#settingsCard').children().first().click()
    cy.get('#settingsCard').contains('Shuffle items').click()
    startGame()
    cy.get('#timerCard').find('button').contains('Give up').click()

    cy.get('#itemsCard').find('li').first().contains('Mercury').should('exist')
  })

  it('requires capitalization', () => {
    startGame()
    cy.get('#inputField').type('mercury')
    cy.get('#itemsCard').contains('Items (1/8)').should('exist')
    resetGame()

    cy.get('#settingsCard').contains('Require proper capitalization').click()
    startGame()
    cy.get('#inputField').type('mercury')

    cy.get('#itemsCard').contains('Items (0/8)').should('exist')

    cy.get('#inputField').clear()
    cy.get('#inputField').type('Mercury')

    cy.get('#itemsCard').contains('Items (1/8)').should('exist')
  })

  it('requires whitespaces', () => {
    startGame()
    cy.get('#inputField').type('mer cury')
    cy.get('#itemsCard').contains('Items (1/8)').should('exist')
    resetGame()

    cy.get('#settingsCard').contains('Require whitespaces').click()
    startGame()
    cy.get('#inputField').type('mer cury')

    cy.get('#itemsCard').contains('Items (0/8)').should('exist')

    cy.get('#inputField').clear()
    cy.get('#inputField').type('mercury')

    cy.get('#itemsCard').contains('Items (1/8)').should('exist')
  })

  it('requires ordering', () => {
    startGame()
    cy.get('#inputField').type('venus')
    cy.get('#itemsCard').contains('Items (0/8)').should('exist')
    cy.get('#inputField').clear()
    cy.get('#inputField').type('mercury')
    cy.get('#itemsCard').contains('Items (1/8)').should('exist')
    resetGame()

    cy.get('#settingsCard').contains('Require right ordering').click()
    startGame()
    cy.get('#inputField').type('venus')

    cy.get('#itemsCard').contains('Items (1/8)').should('exist')
  })

  it('respects combination of settings', () => {
    cy.get('#settingsCard').contains('Require whitespaces').click()
    cy.get('#settingsCard').contains('Require proper capitalization').click()
    startGame()

    cy.get('#inputField').type('venus')
    cy.get('#itemsCard').contains('Items (0/8)').should('exist')

    cy.get('#inputField').clear()
    cy.get('#inputField').type('mercury')
    cy.get('#itemsCard').contains('Items (0/8)').should('exist')

    cy.get('#inputField').clear()
    cy.get('#inputField').type('Mer cury')
    cy.get('#itemsCard').contains('Items (0/8)').should('exist')

    cy.get('#inputField').clear()
    cy.get('#inputField').type('Mercury')
    cy.get('#itemsCard').contains('Items (1/8)').should('exist')
  })
})

describe('/play game', () => {
  it('matches some', () => {
    cy.get('button').contains("I'm ready!").click()

    cy.get('#inputField').type('mercury')
    cy.get('#inputField').type('venus')
    cy.get('#inputField').type('earth')
    cy.get('#inputField').type('mars')

    cy.get('#itemsCard').contains('Items (4/8)').should('exist')

    cy.get('#itemsCard').contains('Mercury').should('exist')
    cy.get('#itemsCard').contains('Venus').should('exist')
    cy.get('#itemsCard').contains('Earth').should('exist')
    cy.get('#itemsCard').contains('Mars').should('exist')
  })

  it('starts timer when typing', () => {
    cy.get('#settingsCard').contains('Allow pauses').click()
    cy.get('button').contains("I'm ready!").click()

    cy.get('#inputField').type('a')

    cy.get('#timerCard').find('button').contains('Start').should('not.exist')
    cy.get('#timerCard').find('button').contains('Give up').should('not.exist')
    cy.get('#timerCard').find('button').contains('Pause').click()

    cy.get('#inputField').type('a')

    cy.get('#timerCard').find('button').contains('Start').should('not.exist')
    cy.get('#timerCard').find('button').contains('Give up').should('not.exist')
    cy.get('#timerCard').find('button').contains('Pause').click()
  })

  it('ends game when all items named', () => {
    cy.get('button').contains("I'm ready!").click()

    cy.get('#inputField').type('mercury')
    cy.get('#inputField').type('venus')
    cy.get('#inputField').type('earth')
    cy.get('#inputField').type('mars')
    cy.get('#inputField').type('jupiter')
    cy.get('#inputField').type('saturn')
    cy.get('#inputField').type('uranus')
    cy.get('#inputField').type('neptun')

    cy.get('#timerCard').should('not.exist')
    cy.get('div').contains('You did it!').should('exist')
    cy.get('#list-preview-planets').find('button').contains('Restart').should('exist')
  })

  it('notifies on new record', () => {
    cy.get('button').contains("I'm ready!").click()

    cy.get('#inputField').type('mercury')
    cy.get('#inputField').type('venus')
    cy.get('#inputField').type('earth')
    cy.get('#inputField').type('mars')
    cy.get('#inputField').type('jupiter')
    cy.get('#inputField').type('saturn')
    cy.get('#inputField').type('uranus')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
    cy.get('#inputField').type('neptun')

    cy.get('#list-preview-planets').find('button').contains('Restart').click()
    cy.get('button').contains("I'm ready!").click()

    cy.get('#inputField').type('mercury')
    cy.get('#inputField').type('venus')
    cy.get('#inputField').type('earth')
    cy.get('#inputField').type('mars')
    cy.get('#inputField').type('jupiter')
    cy.get('#inputField').type('saturn')
    cy.get('#inputField').type('uranus')
    cy.get('#inputField').type('neptun')

    cy.get('dialog').contains('New record').should('exist')
  })
})

beforeEach(() => {
  cy.window().then((window) => {
    window.localStorage.setItem('completedHelp', 'true')
  })
  cy.visit('/#/play/planets')
})
