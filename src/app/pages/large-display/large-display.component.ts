import { Component, OnInit, } from '@angular/core';
import { TimerService } from '../../services/timer.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { TeacherRoundService } from '../../services/teacher-round.service';
import { TeacherSessionService } from '../../services/teacher-session.service';
import { ActivatedRoute } from '@angular/router';

/**
 * Over the course of a session, the large display will show several
 * different screens with different contents. For example, it will show when
 * the students are joining the round, and another screen after the round has
 * started.
 *
 * Each individual screen has a string that identifies it.
 * This type is a union of all of those ID strings.
 */
export enum ScreenId {
  Lobby,
  LoadingSession,
  DuringTheRound,
}

@Component({
  selector: 'app-large-display',
  templateUrl: './large-display.component.html',
  styleUrls: ['./large-display.component.scss']
})
export class LargeDisplayComponent implements OnInit {
  // Expose this enum to the template
  readonly ScreenId = ScreenId;

  loadingSession$ = new BehaviorSubject<boolean>(true);

  currentScreen$: Observable<ScreenId> = this.loadingSession$.pipe(
    switchMap(loading =>
      loading
        ? of(ScreenId.LoadingSession)
        : this.teacherSessionService.currentRoundPath$.pipe(
          map(roundPath =>
            roundPath === null
              ? ScreenId.Lobby
              : ScreenId.DuringTheRound
          ),
        )
    ),
  );

  roundStatus$ = this.teacherRoundService.roundStatus$;

  constructor(
    public timerService: TimerService,
    public teacherRoundService: TeacherRoundService,
    public teacherSessionService: TeacherSessionService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.teacherSessionService.setCurrentSession(params.get('sessionId'));
      this.quitRound().then(() => {
        this.loadingSession$.next(false);
      });
    });
  }

  quitRound() {
    return this.teacherRoundService.endRound();
  }

  toggleTimerRunning() {
    this.timerService.running$.pipe(take(1)).subscribe(running => {
      this.timerService.setRunning(!running);
    });
  }
}
