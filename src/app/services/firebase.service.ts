import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Session, SessionWithId, SessionStudentData } from '../session';
import { map, mapTo } from 'rxjs/operators';
import { FirebaseRound, RoundStudentData, Interaction, HostEvent } from './../round';
import { JoinCode, JoinCodeWithId } from '../join-code';
import * as firebase from 'firebase/app';
import firestore = firebase.firestore;

export interface RoundPath {
  sessionId: string;
  roundId: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  allSessions$: Observable<any[]> = this.angularFirestore.collection('sessions').valueChanges();

  constructor(public angularFirestore: AngularFirestore) {  }

  private getSessionDocument(sessionId: string): AngularFirestoreDocument<Session> {
    return this.angularFirestore
      .collection('sessions')
      .doc<Session>(sessionId);
  }

  private getRoundDocument(roundPath: RoundPath) {
    return this.getSessionDocument(roundPath.sessionId)
      .collection('rounds')
      .doc<FirebaseRound>(roundPath.roundId);
  }


  /**
   * Return an observable stream of the session data for the session with
   * Firebase ID `id`.
   *
   * (In case you need the Firebase ID for later, it's saved as a property on
   * the SessionWithId objects emitted from the observable.)
   */
  getSession(id: string): Observable<SessionWithId | null> {
    return this.getSessionDocument(id)
      .snapshotChanges()
      .pipe(map(action =>
        action.payload.exists
          ? {id: action.payload.id, ...action.payload.data()}
          : null
      ));
  }

  getSessionStudent(sessionId: string, studentId: string): Observable<SessionStudentData> {
    return this.getSessionDocument(sessionId)
      .collection('students')
      .doc<SessionStudentData>(studentId)
      .valueChanges();
  }

  sessionStudentRemoved(sessionId: string, studentId: string): Observable<void> {
    // This is a bit of a roundabout way to listen to 'removed' events, but it
    // works! :-)
    return this.getSessionDocument(sessionId)
      .collection('students', ref => ref.where(firestore.FieldPath.documentId(), '==', studentId))
      .stateChanges(['removed']).pipe(mapTo(undefined));
  }

  createSession(sessionData: {hostId: string}): Promise<string> {
    return this.angularFirestore.collection('sessions').add({createdAt: firestore.FieldValue.serverTimestamp(), ...sessionData}).then(doc =>
      doc.id
    );
  }

  getMostRecentSession(userId: string): Observable<SessionWithId | null> {
    return this.angularFirestore
      .collection<Session>('sessions', ref => ref.where('hostId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(1))
      .snapshotChanges()
      .pipe(map(actions =>
        actions[0]?.payload.doc.exists
          ? {id: actions[0].payload.doc.id, ...actions[0].payload.doc.data({serverTimestamps: 'estimate'})}
          : null
      ));
  }

  /**
   * Return an observable stream of the round data for the round whose
   * Firebase ID is `roundId` within the session denoted by `sessionId`.
   */
  getRound(roundPath: RoundPath): Observable<FirebaseRound> {
    return this.getRoundDocument(roundPath).valueChanges();
  }

  getRoundStudent(roundPath: RoundPath, studentId: string): Observable<RoundStudentData> {
    return this.getRoundDocument(roundPath)
      .collection('students')
      .doc<RoundStudentData>(studentId)
      .valueChanges();
  }

  getStudentsInRound(roundPath: RoundPath): Observable<RoundStudentData[]> {
    return  this.getRoundDocument(roundPath)
      .collection<RoundStudentData>('students')
      .valueChanges({idField: 'id'});
  }

  addStudentToRound(id: string, roundPath: RoundPath, studentData: RoundStudentData) {
    this.angularFirestore.collection('sessions/' + roundPath.sessionId + '/rounds/' + roundPath.roundId + '/students')
      .doc(id)
      .set(studentData);
  }


  /**
   * Adds round to firestore and sets round to the session's current round
   * @param sessionID Session ID to which round will be added
   * @param roundData data for the round in FirebaseRound interface format
   */
  createRoundInSession(sessionId: string, roundData: FirebaseRound): Promise<RoundPath> {
    return this.angularFirestore.collection('sessions/' + sessionId + '/rounds').add(roundData).then(doc =>
      ({sessionId, roundId: doc.id})
    );
  }

  setCurrentRound(roundPath: RoundPath) {
    return this.angularFirestore.collection('sessions').doc(roundPath.sessionId)
      .update({currentRoundId: roundPath.roundId});
  }

  /**
   * Returns an observable of all student data as an array of JSON objects
   * @param sessionID the ID of the session the students are in
   */
  getStudentsInSession(sessionId: string): Observable<SessionStudentData[]> {
    return  this.getSessionDocument(sessionId)
      .collection<SessionStudentData>('students')
      .valueChanges({idField: 'id'});
  }

  /**
   * Adds student to firestore
   * @param id The student's auth ID
   * @param sessionID id of the session that the student will be added to
   * @param studentData map of student's information including name
   */
  addStudentToSession(id: string, sessionId: string, studentData: SessionStudentData) {
    return this.getSessionDocument(sessionId).collection('students').doc<SessionStudentData>(id).set(studentData);
  }

  /**
   * Remove a student from the given session
   * @param id The student's auth ID
   * @param sessionID ID of the session that the student will be removed from
   */
  removeStudentFromSession(id: string, sessionId: string) {
    return this.getSessionDocument(sessionId).collection('students').doc(id).delete();
  }

  /**
   * Update a student in a session
   * @param id The student's auth ID
   * @param sessionID ID of the session that the student will be added to
   * @param studentData the (partial) data to update the student with
   */
  updateStudentInSession(id: string, sessionId: string, studentData: Partial<SessionStudentData>) {
    return this.getSessionDocument(sessionId).collection('students').doc<SessionStudentData>(id).update(studentData);
  }

  /**
   * Modify the data of a particular round firebase.
   *
   * The round in question **MUST** exist already before being updated.
   * If you use a non-existent round path, this method will throw an error.
   *
   * (That way you can never end up with a half-initialized round document;
   * See https://github.com/angular/angularfire/pull/1247#issuecomment-336226671)
   *
   * @param path The Firestore ID of the round to modify, along with with the
   *   ID of the session that it lives in.
   * @param data The new round data.
   */
  updateRoundData(roundPath: RoundPath, data: Partial<FirebaseRound>) {
    return this.getRoundDocument(roundPath).update(data);
  }

  /**
   * Modify the data of a particular round firebase.
   *
   * If round in question does not already exist, it will be created.
   *
   * @param path The Firestore ID of the round to modify, along with with the
   *   ID of the session that it lives in.
   * @param data The new round data.
   */
  setRoundData(roundPath: RoundPath, data: FirebaseRound) {
    return this.getRoundDocument(roundPath).set(data);
  }

  /**
   * Adds an interaction to the `interactions` collection in firebase.
   *
   * @param roundPath The Firestore IDs of the session and round within it to add the interaction to
   * @param data Information about this interaction (the ID of the student, the barcode they interacted with, etc.)
   */
  addInteraction(roundPath: RoundPath, data: Interaction): Promise<DocumentReference> {
    return this.getRoundDocument(roundPath).collection('interactions').add({createdAt: firestore.FieldValue.serverTimestamp(), ...data});
  }

  getStudentInteractions(roundPath: RoundPath, studentId: string): Observable<Interaction[]> {
    return this.angularFirestore.collection<Interaction>(
      'sessions/' + roundPath.sessionId + '/rounds/' + roundPath.roundId + '/interactions',
      ref => ref.where('userId', '==', studentId).orderBy('createdAt', 'desc'),
    ).valueChanges();
  }

  getRoundInteractions(roundPath: RoundPath): Observable<Interaction[]> {
    return this.angularFirestore.collection<Interaction>(
      'sessions/' + roundPath.sessionId + '/rounds/' + roundPath.roundId + '/interactions',
      ref => ref.orderBy('createdAt', 'desc'),
    ).valueChanges();
  }

  /**
   * Adds an host event to the `hostEvents` collection in firebase.
   *
   * @param roundPath The Firestore IDs of the session and round within it to add the interaction to
   * @param eventData The type of event(play, pause, etc) and it's time of occurrence relative to the game
   */
  addHostEvent(roundPath: RoundPath, eventData: Partial<HostEvent>): Promise<DocumentReference> {
    return this.getRoundDocument(roundPath).collection('hostEvents')
      .add({occurredAt: firestore.FieldValue.serverTimestamp(), ...eventData});
  }

  /**
   * Given a join code ID (ie, the six characters) return the join code
   * document (which includes information like what session it belongs to,
   * and a timestamp.)
   */
  getJoinCode(id: string): Observable<JoinCode | undefined> {
    return this.angularFirestore.collection('joinCodes').doc<JoinCode>(id).get().pipe(
      map(doc => (doc as firestore.DocumentSnapshot<JoinCode>).data())
    );
  }

  /**
   * Given a session ID, get all of its join codes (even the expired ones).
   *
   * The resulting list is ordered from most recent to least.
   *
   * @param limit The maximum number of entries to return. (When there are more
   * entries in the database, we'll just truncate the old ones.)
   */
  getMostRecentSessionJoinCodes(sessionId: string, limit = 1): Observable<JoinCodeWithId[]> {
    return this.angularFirestore.collection<JoinCode>(
      'joinCodes',
      ref => ref.where('sessionId', '==', sessionId)
        .orderBy('updatedAt', 'desc')
        .limit(limit)
    ).snapshotChanges().pipe(
      // The local Firestore cache interacts *quite* poorly with join codes; it
      // doesn't know how to handle `firestore.FieldValue.serverTimestamp()`,
      // and it does not apply the firestore.rules to see if the join code can
      // be read/written or not. Because of this, we're going to take some
      // steps to bypass the cache.
      map(snapshot =>
        snapshot.filter(s => s.payload.doc.exists)
          .map(s => ({
            id: s.payload.doc.id,
            // setting serverTimestamps: 'none' means that, in the local
            // cache, we'll temporarily evaluate
            // `firestore.FieldValue.serverTimestamp()` to null while we wait
            // to hear back to the server.
            ...s.payload.doc.data({serverTimestamps: 'none'})
          }))
          // Now, we ignore any join codes with updatedAt set to null. That
          // way, we always wait until we get back the real data from the
          // server, not the pretend cache data.
          .filter(joinCode => joinCode.updatedAt !== null)
      )
    );
  }

  setJoinCode(id: string, sessionId: string) {
    return this.angularFirestore.collection('joinCodes').doc<JoinCode>(id)
    .set({updatedAt: firestore.FieldValue.serverTimestamp(), sessionId});
  }

  deleteJoinCode(id: string) {
    return this.angularFirestore.collection('joinCodes').doc<JoinCode>(id).delete();
  }
}
