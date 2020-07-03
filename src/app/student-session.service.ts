import { Injectable } from '@angular/core';
import { SessionWithId, SessionStudentData } from './session';
import { Observable, BehaviorSubject, of, combineLatest } from 'rxjs';
import { switchMap, shareReplay, map, distinctUntilChanged } from 'rxjs/operators';
import { FirebaseService, RoundPath } from './firebase.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentSessionService {

  constructor(private firebaseService: FirebaseService, private authService: AuthService) {
  }

  sessionId$ = new BehaviorSubject<string | null>(null);

  /**
   * This observable says what session the student is currently connected to.
   * (If the student isn't connected to a session, then it emits null.)
   *
   * This observable emits under the following circumstances:
   * - when you initially subscribe to it,
   * - when the student joins or leaves a session,
   * - and when the contents of the current session change in Firebase.
   */
  currentSession$: Observable<SessionWithId | null> = this.sessionId$.pipe(
    switchMap(sessionId =>
      sessionId
        ? this.firebaseService.getSession(sessionId)
        : of(null)
    ),
    shareReplay(1),
  );

  /**
   * An observable of the current round's session ID and round ID.
   * Emits null if the student is not in a session or the round is not set on the session.
   */
  currentRoundPath$: Observable<RoundPath | null> = this.currentSession$.pipe(
    map(session =>
      session && session.currentRoundId
        ? {sessionId: session.id , roundId: session.currentRoundId}
        : null
    ),
    distinctUntilChanged((prev, curr) =>
      prev?.roundId === curr?.roundId && prev?.sessionId === curr?.sessionId
    ),
    shareReplay(1),
  );

  sessionStudentData$: Observable<SessionStudentData | null> = combineLatest([this.sessionId$, this.authService.currentUser$]).pipe(
    switchMap(([sessionId, user]) => sessionId && user ? this.firebaseService.getSessionStudent(sessionId, user.uid) : of(null)),
    shareReplay(1)
  );


  /**
   * Temporary function to join a given session by ID
   *
   * @param id session Firebase ID to join
   */
  joinSession(id: string) {
    this.sessionId$.next(id);
  }

  /**
   * Leave a session, if the student is connected to a session.
   *
   * If the student isn't connected to a session, this operation
   * doesn't do anything (besides maybe causing some observables
   * to re-emit).
   */
  leaveSession() {
    this.sessionId$.next(null);
  }

}