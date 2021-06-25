import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TeacherRoundService } from 'src/app/services/teacher-round.service';

@Component({
  selector: 'app-ld-post-round',
  templateUrl: './ld-post-round.component.html',
  styleUrls: ['./ld-post-round.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LdPostRoundComponent implements OnInit {

  constructor(public teacherRoundService: TeacherRoundService) { }

  ngOnInit(): void {
  }

}
