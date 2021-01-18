import * as firebase from '@firebase/testing';
import { createSession, noAuth, alice, admin, addStudentToSession, bob, otherUser, adminUser } from './firebase-helpers';
import { loadFirestoreRules, clearFirestore, deleteFirestoreInstances } from './firebase-helpers';

beforeAll(loadFirestoreRules);

beforeEach(clearFirestore);

afterAll(clearFirestore);
afterAll(deleteFirestoreInstances);

describe('Sessions', () => {
  it('refuses to create if you aren\'t authenticated', async () => {
    await firebase.assertFails(createSession(noAuth, {hostId: 'some-host-id'}));
  });

  it('refuses to create if the hostId doesn\'t match your current UID', async () => {
    await firebase.assertFails(createSession(alice, {hostId: 'not-alice'}));
  });

  it('successfully creates if you are authenticated and the hostId matches your current UID', async () => {
    await firebase.assertSucceeds(createSession(alice, {hostId: 'alice'}));
  });

  it('cannot be updated by users other than the teacher', async () => {
    const doc = await createSession(admin, {hostId: 'alice'});
    await addStudentToSession(admin, 'bob', doc.id, {
      name: 'Bob',
      nestBarcode: 22
    });
    const users = [
      bob,
      otherUser,
      noAuth
    ];
    for (const user of users) {
      await firebase.assertFails(user.doc(doc.path).update({hostId: 'otheruser'}));
      await firebase.assertFails(user.doc(doc.path).update({hostId: null}));
      await firebase.assertFails(user.doc(doc.path).update({hostId: 'alice'}));
      await firebase.assertFails(user.doc(doc.path).update({
        currentRound: 'round1',
      }));
    }
  });

  it('can be updated by the teacher', async () => {
    const doc = await createSession(admin, {hostId: 'alice'});
    await firebase.assertSucceeds(alice.doc(doc.path).update({
      currentRound: 'round1',
    }));
  });

  it('the hostId cannot be changed, even by the teacher', async () => {
    const doc = await createSession(admin, {hostId: 'alice'});
    await firebase.assertFails(alice.doc(doc.path).update({hostId: 'otheruser'}));
    await firebase.assertFails(alice.doc(doc.path).update({hostId: null}));
  });

  // Eventually, we may add a way to delete sessions, but for the moment this
  // isn't allowed.
  it('cannot be deleted by any user', async () => {
    const doc = await createSession(admin, {hostId: 'alice'});
    await addStudentToSession(admin, 'bob', doc.id, {
      name: 'Bob',
      nestBarcode: 22
    });
    await firebase.assertFails(alice.doc(doc.path).delete());
    await firebase.assertFails(bob.doc(doc.path).delete());
    await firebase.assertFails(otherUser.doc(doc.path).delete());
    await firebase.assertFails(noAuth.doc(doc.path).delete());
  });

  it('can be read by the teacher and students', async () => {
    const doc = await createSession(admin, {hostId: 'alice'});
    await addStudentToSession(admin, 'bob', doc.id, {
      name: 'Bob',
      nestBarcode: 22
    });
    await firebase.assertSucceeds(alice.doc(doc.path).get());
    await firebase.assertSucceeds(bob.doc(doc.path).get());
  });

  it('cannot be read by users not in the session', async () => {
    const doc = await createSession(admin, {hostId: 'alice'});
    await firebase.assertFails(otherUser.doc(doc.path).get());
    await firebase.assertFails(noAuth.doc(doc.path).get());
  });

  it('can be read by admins', async () => {
    const doc = await createSession(admin, {hostId: 'alice'});
    await firebase.assertSucceeds(adminUser.doc(doc.path).get());
  });

  it('can be created by admins', async () => {
    await firebase.assertSucceeds(createSession(adminUser, {hostId: 'alice'}));
  });

  it('can be updated by admins', async () => {
    const doc = await createSession(admin, {hostId: 'alice'});
    await firebase.assertSucceeds(adminUser.doc(doc.path).update({hostId: 'otheruser'}));
  });

  it('can be deleted by admins', async () => {
    const doc = await createSession(admin, {hostId: 'alice'});
    await firebase.assertSucceeds(adminUser.doc(doc.path).delete());
  });
});
