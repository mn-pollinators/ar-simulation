import { firestore } from 'firebase';
import { JoinCode } from 'src/app/join-code';
import { MAX_NEST_MARKER, MIN_NEST_MARKER } from 'src/app/markers';
import { Session } from 'src/app/session';
import { FirebaseRound } from 'src/app/round';
import { clearAllStudents, clearAllSessions, clearAllJoinCodes, clearAllRounds, TEST_UID } from 'cypress/support/firebase-utils';


interface FormData {
  joinCodeId: string;
  name: string;
  nest: number;
}

function fillOutForm(formData: Partial<FormData>) {
  if ('joinCodeId' in formData) {
    cy.get('input[formControlName=joinCodeControl]')
      .type(formData.joinCodeId)
      .blur();
  }
  if ('name' in formData) {
    cy.get('input[formControlName=nameControl]')
      .type(formData.name)
      .blur();
  }
  if ('nest' in formData) {
    cy.get('input[formControlName=nestControl]')
      .type(formData.nest.toString())
      .blur();
  }
}

describe('The join page', () => {
  const mockSessionId = '123Session';
  const mockSession: Session = {
    hostId: 'ScoobyDoo',
    createdAt: firestore.Timestamp.now(),
  };

  const mockJoinCodeId = '123456';
  const mockJoinCode: JoinCode = {
    sessionId: mockSessionId,
    updatedAt: firestore.Timestamp.now(),
  };

  // If you put in these values, you should be able to join the session.
  const goodFormInput: FormData = {
    joinCodeId: mockJoinCodeId,
    name: 'Fred',
    nest: 20,
  };

  beforeEach(() => {
    clearAllStudents(mockSessionId);
    clearAllSessions();
    clearAllJoinCodes();
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/play');
  });

  it('Should load', () => {
    cy.get('[data-cy=joinSessionPage]').should('exist');
  });

  context('When there isn\'t a round in progress', () => {
    beforeEach(() => {
      cy.callFirestore('set', `sessions/${mockSessionId}`, mockSession);
      cy.callFirestore('set', `joinCodes/${mockJoinCodeId}`, mockJoinCode);
    });

    context('Entering acceptable values into the form', () => {
      it('Should enable the join-session button"', () => {
        fillOutForm(goodFormInput);
        cy.get('[data-cy=joinSession]').should('not.be.disabled');
      });

      describe('…and clicking the join-session button', () => {
        it('Should redirect you to the right page', () => {
          fillOutForm(goodFormInput);
          cy.get('[data-cy=joinSession]').should('not.be.disabled');
          cy.get('[data-cy=joinSession]').click();
          cy.url().should('include', `/play/${mockSessionId}`);
        });

        it('Should add you to the session in firebase', () => {
          fillOutForm(goodFormInput);
          cy.get('[data-cy=joinSession]').should('not.be.disabled');
          cy.get('[data-cy=joinSession]').click();
          cy.url().should('include', `/play/${mockSessionId}`);
          cy.callFirestore('get', `sessions/${mockSessionId}/students`)
            .should('have.lengthOf', 1);
          cy.callFirestore('get', `sessions/${mockSessionId}/students`)
            .its(0)
            .its('id')
            .should('equal', TEST_UID);
        });

        it('Should give you the right name in firebase', () => {
          fillOutForm(goodFormInput);
          cy.get('[data-cy=joinSession]').should('not.be.disabled');
          cy.get('[data-cy=joinSession]').click();
          cy.url().should('include', `/play/${mockSessionId}`);
          cy.callFirestore(
              'get',
              `sessions/${mockSessionId}/students/${TEST_UID}`,
            )
            .its('name')
            .should('equal', goodFormInput.name);
        });
      });
    });

    context('Using space characters in the join code', () => {
      for (const goodJcId of [
        mockJoinCodeId.match(/[0-9]{3}/g).join(' '),
        // NO-BREAK SPACE
        mockJoinCodeId.match(/[0-9]{3}/g).join('\u00A0'),
        // CHARACTER TABULATION
        mockJoinCodeId.match(/[0-9]{3}/g).join('\t'),
        // ZERO WIDTH NO-BREAK SPACE
        mockJoinCodeId.match(/[0-9]{3}/g).join('\uFEFF'),
        mockJoinCodeId.split('').join(' '),
        `   ${mockJoinCodeId.match(/[0-9]{2}/g).join('   ')}   `,
      ]) {
        context(`"${goodJcId}"`, () => {
          it('Should enable the join-session button and not display a validation message', () => {
            fillOutForm({ ...goodFormInput, joinCodeId: goodJcId });
            cy.get('[data-cy=joinSession]').should('not.be.disabled');
            cy.get('mat-error').should('not.exist');
          });

          describe('…and clicking the join-session button', () => {
            it('Should redirect you to the right page and add you to the session in firebase', () => {
              fillOutForm({ ...goodFormInput, joinCodeId: goodJcId });
              cy.get('[data-cy=joinSession]').should('not.be.disabled');
              cy.get('[data-cy=joinSession]').click();
              cy.url().should('include', `/play/${mockSessionId}`);
              cy.callFirestore('get', `sessions/${mockSessionId}/students`)
                .should('have.lengthOf', 1);
              cy.callFirestore('get', `sessions/${mockSessionId}/students`)
                .its(0)
                .its('id')
                .should('equal', TEST_UID);
            });
          });
        });
      }

    });

    context('Entering bad values into the form', () => {
      describe('Using the malformed join code', () => {
        for (const badJcId of [
          'likeZoinksScoob',
          '1',
          '1     ',
          '     1',
          '   1  ',
          '-123456',
          '-12345',
          '1234567',
          '0123456',
          '   12 34  5  67 ',
          '01 2 34 5 6',
          // Eastern Arabic numerals, from Unicode.
          '٢٢٠٩١٠',
          // Chinese/Japanese numerals
          '一二三四五六',
          // Fullwidth characters
          '１２３４５６'
        ]) {
          context(`"${badJcId}"`, () => {
            it('Should disable the join-session button', () => {
              fillOutForm({ ...goodFormInput, joinCodeId: badJcId });
              cy.get('[data-cy=joinSession]').should('be.disabled');
            });

            it('Should display a validation message', () => {
              fillOutForm({ ...goodFormInput, joinCodeId: badJcId });
              cy.get('mat-error').should('exist');
            });
          });
        }
      });

      context('Using a well-formed but non-existent join code', () => {
        it('Should display an error message in a snackbar', () => {
          fillOutForm({ ...goodFormInput, joinCodeId: '220910' });
          cy.get('[data-cy=joinSession]').should('not.be.disabled');
          cy.get('[data-cy=joinSession]').click();
          cy.get('simple-snack-bar').should('exist');
        });
      });

      context('Using the invalid nest number', () => {
        for (const badNestNumber of [
          0,
          MIN_NEST_MARKER - 1,
          MAX_NEST_MARKER + 1,
        ]) {
          context(`…${badNestNumber}`, () => {
            it('Should disable the join-session button', () => {
              fillOutForm({ ...goodFormInput, nest: badNestNumber });
              cy.get('[data-cy=joinSession]').should('be.disabled');
            });

            it('Should display a validation message', () => {
              fillOutForm({ ...goodFormInput, nest: badNestNumber });
              cy.get('mat-error').should('exist');
            });
          });
        }
      });
    });

    context('Omitting form values', () => {
      context('Not providing a join code', () => {
        it('Should disable the join-session button', () => {
          const { joinCodeId, ...rest } = goodFormInput;
          fillOutForm(rest);
          cy.get('[data-cy=joinSession]').should('be.disabled');
        });
      });

      context('Not providing a name', () => {
        it('Should disable the join-session button', () => {
          const { name, ...rest } = goodFormInput;
          fillOutForm(rest);
          cy.get('[data-cy=joinSession]').should('be.disabled');
        });
      });

      context('Not providing a nest number', () => {
        it('Should disable the join-session button', () => {
          const { nest, ...rest } = goodFormInput;
          fillOutForm(rest);
          cy.get('[data-cy=joinSession]').should('be.disabled');
        });
      });
    });
  });

  context('When there is a round in progress', () => {
    const mockRoundId = '123Round';
    const mockRound: FirebaseRound = {
      flowerSpeciesIds: [],
      status: 'good!',
      running: false,
      currentTime: 0,
    };

    before(() => {
      clearAllRounds(mockSessionId);
      clearAllStudents(mockSessionId);
      clearAllSessions();
      clearAllJoinCodes();
    });

    beforeEach(() => {
      // We're actually creating the round before the session it belongs to,
      // but Firestore is pretty loosey-goosey about creating documents, so
      // that shouldn't make a difference! :)
      cy.callFirestore(
        'set',
        `sessions/${mockSessionId}/rounds/${mockRoundId}`,
        mockRound,
      );

      cy.callFirestore(
        'set',
        `sessions/${mockSessionId}`,
        { ...mockSession, currentRoundId: mockRoundId },
      );

      cy.callFirestore('set', `joinCodes/${mockJoinCodeId}`, mockJoinCode);
    });

    afterEach(() => {
      clearAllRounds(mockSessionId);
      clearAllStudents(mockSessionId);
      clearAllSessions();
      clearAllJoinCodes();
    });

    context('Even when you enter acceptable values into the form and click the join-session button', () => {
      it('Should not redirect you to the "play" page for that session', () => {
        fillOutForm(goodFormInput);
        cy.get('[data-cy=joinSession]').should('not.be.disabled');
        cy.get('[data-cy=joinSession]').click();
        // We can't test that a redirect *never* happens--we'd have to wait
        // forever to be absolutely sure. So, instead, we'll just stand here
        // for one second, and if we haven't been redirected by then, we'll
        // call it good.
        cy.wait(1000);
        cy.url().should('not.include', `/play/${mockSessionId}`);
      });

      it('Should not add you to the session in firebase', () => {
        fillOutForm(goodFormInput);
        cy.get('[data-cy=joinSession]').should('not.be.disabled');
        cy.get('[data-cy=joinSession]').click();
        cy.wait(1000);
        // If a subcollection is empty, getting it returns null.
        cy.callFirestore('get', `sessions/${mockSessionId}/students`)
          .should('be.null');
      });

      it('Should display an error message in a snackbar', () => {
        fillOutForm(goodFormInput);
        cy.get('[data-cy=joinSession]').should('not.be.disabled');
        cy.get('[data-cy=joinSession]').click();
        cy.get('simple-snack-bar').should('exist');
      });
    });
  });
});
