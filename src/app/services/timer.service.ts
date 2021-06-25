import { Injectable } from '@angular/core';
import { tick } from '@angular/core/testing';
import { Subject, Observable, interval, of, concat } from 'rxjs';
import { scan, switchMap, map, distinctUntilChanged, shareReplay, take, filter } from 'rxjs/operators';
import { Month, TimePeriod } from '../time-period';

interface TimerState {
  running: boolean;

  /**
   * How many milliseconds per full TimePeriod tick.
   */
  tickSpeed: number;

  /**
   * The number of milliseconds that have elapsed (adjusted for startTime).
   */
  currentMs: number;

  /**
   * The time in ms to stop the timer.
   */
  endTimeMs: number;

  done: boolean;
}

/**
 * The base rate the timer ticks at, in ms.
 */
export const baseTickSpeed = 500;

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private events$: Subject<Partial<TimerState>> = new Subject();

  private timerState$: Observable<TimerState>;

  /**
   * This stream emits the current time period.
   *
   * It emits whenever the time period changes, or whenever the timer is
   * unpaused.
   */
  currentTimePeriod$: Observable<TimePeriod>;

  /**
   * This stream emits fractional time periods.
   *
   * (Fractional time periods are represented as floating-point values between
   * 0 and MAX_TIME, inclusive, where 0 is the first quarter of January and
   * MAX_TIME is the last quarter of December.)
   *
   * This stream emits whenever the fractional time period changes.
   */
  currentTimePrecise$: Observable<number>;

  /**
   * This stream emits the current month.
   *
   * It emits whenever the current month changes.
   */
  currentMonth$: Observable<Month>;

  /**
   * Whether the timer is currently running.
   *
   * This Observable emits whenever the timer starts or stops.
   */
  running$: Observable<boolean>;


  done$: Observable<boolean>;

  constructor() {
    this.timerState$ = this.events$.pipe(
      scan((state: TimerState, nextEvent: Partial<TimerState>): TimerState => ({ ...state, ...nextEvent })),
      switchMap((state: TimerState) =>
        state.running
          ? concat(
            // We're going to be mutating state, so emit a copy, not the real
            // thing.
            of(Object.assign({}, state)),
            interval(baseTickSpeed).pipe(
              // Use map instead of tap to make sure that the pipe waits for
              // the callback to complete.
              map(() => {
                state.currentMs += baseTickSpeed;
                // When we get to the end, stop the timer.
                if (state.currentMs >= state.endTimeMs) {
                  state.currentMs = state.endTimeMs;
                  this.endRound();
                }
              }),
              map(() => Object.assign({}, state)),
            )
          ) : of(Object.assign({}, state))
      ),
      shareReplay(1)
    );
    this.timerState$.subscribe(() => {});

    this.currentTimePrecise$ = this.timerState$.pipe(
      map(({currentMs, tickSpeed}) =>
        currentMs / tickSpeed
      ),
      distinctUntilChanged(),
      shareReplay(1)
    );
    this.currentTimePrecise$.subscribe(() => {});

    this.currentTimePeriod$ = this.timerState$.pipe(
      map(({running, endTimeMs, currentMs, tickSpeed}) => ({
        running,
        currentTime: Math.floor(Math.min(currentMs, endTimeMs - tickSpeed) / tickSpeed)
      })),
      distinctUntilChanged((previousState, currentState) =>
        // the time didn't change
        previousState.currentTime === currentState.currentTime
          // and the timer wasn't just unpaused.
          && !(!previousState.running && currentState.running)
      ),
      map(state => new TimePeriod(state.currentTime)),
      shareReplay(1)
    );
    this.currentTimePeriod$.subscribe(() => {});

    this.currentMonth$ = this.currentTimePeriod$.pipe(
      map(timePeriod => timePeriod.month),
      distinctUntilChanged(),
      shareReplay(1)
    );
    this.currentMonth$.subscribe();

    this.running$ = this.timerState$.pipe(
      map(state => state.running),
      distinctUntilChanged((prev, curr) => prev === curr),
      shareReplay(1),
    );
    this.running$.subscribe(() => {});

    this.done$ = this.timerState$.pipe(
      map(state => state.done),
      distinctUntilChanged((prev, curr) => prev === curr),
      shareReplay(1),
    );
    this.done$.subscribe(() => {});
  }

  /**
   * Give the timer an initial state.
   *
   * Some notes:
   *
   * - You can't call `setRunning()` or `setTime()` before initializing the
   *   timer.
   *
   * - If you initialize the timer to the running state, it will start ticking
   *   right away.
   *
   * - You can re-initialize the timer if you want to completely override its
   *   state.
   *
   * @param running Whether the timer is currently paused.
   *
   * @param tickSpeed How many milliseconds there are per tick.
   *
   * (Note that there is a limit to the resolution of the timer; it can't
   * distinguish between intervals smaller than `baseTickSpeed` milliseconds.
   * Because of this, all tick speeds will be rounded to a multiple of
   * `baseTickSpeed`.)
   *
   * @param startTime The initial TimePeriod.
   *
   * @param endTime When the timer reaches this TimePeriod, it will tick all
   * the way through the end time, and then pause itself.
   *
   * (The end time is an inclusive endpoint.)
   *
   * @throws {@link RangeError} if startTime is greater than endTime
   * @throws {@link RangeError} if tickSpeed is less than baseTickSpeed
   */
  initialize(startTime: TimePeriod, endTime: TimePeriod, tickSpeed: number, running = false) {
    if (startTime.time > endTime.time) {
      throw new RangeError('Cannot initialize timer: startTime should come before endTime.');
    }
    if (tickSpeed < baseTickSpeed) {
      throw new RangeError(
        `Cannot initialize timer: timer service doesn't have fine enough`
        + ` resolution to measure durations of ${tickSpeed} milliseconds.`
      );
    }

    // coerce tickSpeed to a multiple of baseTickSpeed
    tickSpeed = Math.round(tickSpeed / baseTickSpeed) * baseTickSpeed;

    const initialState: TimerState = {
      endTimeMs: (endTime.time + 1) * tickSpeed, // saves us a bit of math in the main timer loop
      currentMs: startTime.time * tickSpeed,
      tickSpeed,
      running,
      done: false
    };

    this.events$.next(initialState);
  }

  /**
   * Play or pause the timer.
   *
   * You *must* initialize the timer before calling this method.
   */
  setRunning(running: boolean) {
    this.events$.next({running});
  }

  endRound() {
    this.events$.next({running: false, done: true});
  }

  /**
   * Set the current time.
   *
   * You *must* initialize the timer before calling this method.
   *
   * This method does not pause the timer; if you call `setTime()` while the
   * timer is running, it will stay running.
   *
   * @param newTime the new TimePeriod to set the timer to.
   */
  async setTime(newTime: TimePeriod) {
    const {tickSpeed} = await this.timerState$.pipe(take(1)).toPromise();
    this.events$.next({
      currentMs: newTime.time * tickSpeed
    });
  }
}
