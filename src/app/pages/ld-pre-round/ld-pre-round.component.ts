import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TeacherRoundService } from 'src/app/services/teacher-round.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-ld-pre-round',
  templateUrl: './ld-pre-round.component.html',
  styleUrls: ['./ld-pre-round.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LdPreRoundComponent implements OnInit {

  roundTemplate$ = this.teacherRoundService.roundTemplate$;

  constructor(public teacherRoundService: TeacherRoundService,) { }

  ngOnInit(): void {
  }

}
