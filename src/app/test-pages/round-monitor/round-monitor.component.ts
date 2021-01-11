import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { allBeeSpecies, BeeSpecies } from 'src/app/bees';
import { Interaction, RoundStudentData } from 'src/app/round';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StudentRoundService } from 'src/app/services/student-round.service';
import { StudentSessionService } from 'src/app/services/student-session.service';
import { TeacherSessionService } from 'src/app/services/teacher-session.service';
import { TimePeriod } from 'src/app/time-period';

@Component({
  selector: 'app-round-monitor',
  templateUrl: './round-monitor.component.html',
  styleUrls: ['./round-monitor.component.scss']
})
export class RoundMonitorComponent implements OnInit, OnDestroy {

  constructor(
    public authService: AuthService,
    public firebaseService: FirebaseService,
    public studentSessionService: StudentSessionService,
    public studentRoundService: StudentRoundService,
    public teacherSessionService: TeacherSessionService,
    private activatedRoute: ActivatedRoute
  ) { }



  roundInteractions$: Observable<Interaction[]> = this.studentSessionService.currentRoundPath$.pipe(
    switchMap(path => path ? this.firebaseService.getRoundInteractions(path) : of([]))
  );

  roundStudents$: Observable<RoundStudentData[]> = this.studentSessionService.currentRoundPath$.pipe(
    switchMap(path => path ? this.firebaseService.getStudentsInRound(path) : of([]))
  );

  roundInteractionsWithFlowers$ = combineLatest([
    this.roundInteractions$,
    this.studentRoundService.currentFlowersSpecies$
  ]).pipe(
    map(([interactions, flowers]) => interactions.map(i => ({
      ...i,
      flower: !i.isNest ? flowers[i.barcodeValue - 1] : null,
      timePeriod: new TimePeriod(i.timePeriod)
    })))
  );

  students$ = combineLatest([
    this.teacherSessionService.studentsInCurrentSession$,
    this.roundStudents$,
    this.roundInteractionsWithFlowers$,
    this.studentRoundService.currentTime$
  ]).pipe(
    map(([sessionStudents, roundStudents, roundInteractions, time]) => {
      return sessionStudents.map(sessionStudent => {
        const roundStudent = roundStudents.find(x => x.id === sessionStudent.id);
        const interactions = roundInteractions.filter(i => i.userId === sessionStudent.id);
        const bee = roundStudent ? allBeeSpecies[roundStudent.beeSpecies] as BeeSpecies : null;
        let recentFlowerInteractions = 0;
        for (const interaction of interactions) {
          if (interaction.isNest) {
            break;
          }
          recentFlowerInteractions++;
        }
        return {
          ...sessionStudent,
          ...roundStudent,
          bee,
          beeActive: bee && time && bee.active_period.some(interval => time.fallsWithin(...interval)),
          interactions,
          totalPollen: interactions.filter(interaction => !interaction.isNest).length,
          currentPollen: recentFlowerInteractions,
        };
      });
    })
  );



  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.studentSessionService.setCurrentSession(params.get('sessionId'));
      this.teacherSessionService.setCurrentSession(params.get('sessionId'));
    });
  }

  ngOnDestroy() {
    this.studentSessionService.leaveSession();
    this.teacherSessionService.leaveSession();
  }

  trackInteractions(index, item: {id: string}) {
    return item.id;
  }



}
