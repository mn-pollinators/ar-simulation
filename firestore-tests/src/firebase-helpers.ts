import * as firebase from '@firebase/testing';
import { firestore } from '@firebase/testing';
import * as fs from 'fs';
import { SessionStudentData } from '../../src/app/session';
import { JoinCode } from '../../src/app/join-code';
import { RoundStudentData, FirebaseRound, Interaction, HostEvent } from '../../src/app/round';
import { roundTemplates } from '../../src/app/round-template';

const PROJECT_ID = 'firestore-testing-project';

/**
 * The FIRESTORE_EMULATOR_HOST environment variable is set automatically
 * by "firebase emulators:exec"
 */
const COVERAGE_URL =
  `http://${process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080'}/emulator/v1/projects/${PROJECT_ID}:ruleCoverage.html`;

console.log(`View firestore.rules coverage at ${COVERAGE_URL}`);

/**
 * Creates a new client FirebaseApp with authentication and returns the Firestore instance.
 */
export function getAuthedFirestore(auth) {
  return firebase
    .initializeTestApp({ projectId: PROJECT_ID, auth })
    .firestore();
}


/* These functions are useful for setup and teardown. */

export async function loadFirestoreRules() {
  // Load the rules file before the tests begin
  const rules = fs.readFileSync('firestore.rules', 'utf8');
  await firebase.loadFirestoreRules({ projectId: PROJECT_ID, rules });
}

export async function clearFirestore() {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId: PROJECT_ID });
}

export async function deleteFirestoreInstances() {
  // Delete all the FirebaseApp instances created during testing
  // Note: this does not affect or clear any data
  await Promise.all(firebase.apps().map((app) => app.delete()));
}


/*
 * These firestore instances all have different permissions. We want to test
 * what operations each of these instances is allowed to perform.
 */

export const admin = firebase.initializeAdminApp({ projectId: PROJECT_ID }).firestore();

// Alice is usually the teacher who is hosting the session
export const alice = getAuthedFirestore({uid: 'alice'});

// Bob and Carol are usually students in the session
export const bob = getAuthedFirestore({uid: 'bob'});
export const carol = getAuthedFirestore({uid: 'carol'});

// Other user is an authenticated user who is not in the session
export const otherUser = getAuthedFirestore({uid: 'otheruser'});

// noAuth is an unauthenticated user
export const noAuth = getAuthedFirestore(null);

// adminUser is a user with the admin claim
export const adminUser = getAuthedFirestore({uid: 'adminuser', admin: true});


/* These are some utility functions for manipulating firestore. */

/* Sessions */

export function createSession(db: firestore.Firestore, sessionData: {hostId: string}) {
  return db.collection('sessions')
    .add({createdAt: firestore.FieldValue.serverTimestamp(), ...sessionData});
}

export async function addStudentToSession(
  db: firestore.Firestore,
  id: string, sessionID: string,
  studentData: SessionStudentData,
) {
  const doc = db.collection('sessions/' + sessionID + '/students').doc(id);
  await doc.set(studentData);
  return doc;
}

/* Rounds */

export function createRoundInSession(
  db: firestore.Firestore,
  sessionId: string,
  roundData: FirebaseRound,
) {
  return db.collection('sessions/' + sessionId + '/rounds').add(roundData);
}

export async function addStudentToRound(
  db: firestore.Firestore,
  id: string,
  roundPath: string,
  studentData: RoundStudentData,
) {
  const doc = db
    .collection(roundPath + '/students')
    .doc(id);
  await doc.set(studentData);
  return doc;
}

export function addInteraction(db: firestore.Firestore, roundPath: string, data: Interaction) {
  return db.collection(roundPath + '/interactions').add(data);
}

export function addHostEvent(db: firestore.Firestore, roundPath: string, data: Partial<HostEvent>) {
  return db.collection(roundPath + '/hostEvents').add({occurredAt: firestore.FieldValue.serverTimestamp(), ...data});
}

// Some demo round data to use.
export const demoRound: FirebaseRound = {
  flowerSpeciesIds: roundTemplates[0].flowerSpecies.map(f => f.id),
  status: 'start',
  running: false,
  currentTime: roundTemplates[0].startTime.time
};


/* Join Codes */

export function createJoinCode(db: firestore.Firestore, id: string, joinCodeData: JoinCode) {
  return db.collection('joinCodes').doc(id).set(joinCodeData);
}

export {milliseconds} from '../../src/app/utils/time-utils';

export async function queryJoinCodesBySessionId(db: firestore.Firestore, sessionId: string) {
  return db.collection('joinCodes').where('sessionId', '==', sessionId).get();
}
