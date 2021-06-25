import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { BeeSpecies } from 'src/app/bees';
import { StudentRoundService } from 'src/app/services/student-round.service';
import { FieldGuideDialogComponent } from '../field-guide-dialog/field-guide-dialog.component';

enum ScreenId {
  PreRound,
  PostRound,
  Play,
  InactiveBee,
  Paused
}

@UntilDestroy()
@Component({
  selector: 'app-student-round',
  templateUrl: './student-round.component.html',
  styleUrls: ['./student-round.component.scss']
})
export class StudentRoundComponent implements OnInit {

  constructor(public roundService: StudentRoundService, readonly dialog: MatDialog) { }

  readonly ScreenId = ScreenId;

  currentScreen$: Observable<ScreenId> = this.roundService.currentRound$.pipe(
    filter(round => !!round),
    distinctUntilChanged((x, y) => x.running === y.running && x.status === y.status),
    switchMap(({status, running}) => {
      switch (status) {
        case 'preRound': {
          return of(ScreenId.PreRound);
        }
        case 'postRound': {
          return of(ScreenId.PostRound);
        }
        default: {
          return running
          ? this.roundService.currentBeeActive$.pipe(map(active => active ? ScreenId.Play : ScreenId.InactiveBee))
          : of(ScreenId.Paused);
        }
      }
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  nextActivePeriodText$ = combineLatest(
    [this.roundService.currentTime$, this.roundService.nextActivePeriod$]
  ).pipe(
    map(([currentTime, nextActivePeriod]) =>
      currentTime && nextActivePeriod
      ? currentTime.time + 2 < nextActivePeriod.time ? `in ${nextActivePeriod.monthString}` : 'soon'
      : null
    ),
    distinctUntilChanged()
  );

  onOpenFieldGuide() {
    this.roundService.currentBeeSpecies$.pipe(
      take(1),
      map(species => this.openFieldGuideDialog(species)),
      switchMap(dialog =>
        this.currentScreen$.pipe(
          takeUntil(dialog.afterClosed()),
          filter(screen => screen !== ScreenId.InactiveBee && screen !== ScreenId.PreRound),
          take(1),
          tap(() => dialog.close())
        )
      ),
      untilDestroyed(this),
    ).subscribe();
  }

  /*
   * A helper function to create and open a field guide dialogue.
   *
   * It doesn't make sure that the field guide is closed at the right time;
   * that's the caller's job.
   */
  private openFieldGuideDialog(bee: BeeSpecies) {
    return this.dialog.open(FieldGuideDialogComponent, {
      data: {
        type: 'bee',
        value: bee
      },
      panelClass: 'field-guide-panel',
      maxWidth: null,
      autoFocus: false
    });
  }

  ngOnInit(): void {
  }

}
