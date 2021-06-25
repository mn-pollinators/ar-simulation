import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BeeLayoutItem } from 'src/app/components/flower-layout-with-bees/flower-layout-with-bees.component';
import { FlowerLayoutItem } from 'src/app/components/flower-layout/flower-layout.component';
import { TeacherRoundService } from 'src/app/services/teacher-round.service';
import { TimerService } from 'src/app/services/timer.service';

@Component({
  selector: 'app-ld-play-round',
  templateUrl: './ld-play-round.component.html',
  styleUrls: ['./ld-play-round.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LdPlayRoundComponent implements OnInit {

  flowerLayoutItems$: Observable<FlowerLayoutItem[]> = this.teacherRoundService.currentFlowers$.pipe(
    map(roundFlowers => roundFlowers.map(rf => ({
      imgSrc: rf.species.asset_urls.art_500_wide,
      alt: rf.species.name,
      active: rf.isBlooming,
      scale: rf.species.relative_size
    })))
  );

  beeLayoutItems$: Observable<BeeLayoutItem[]> = this.teacherRoundService.mostRecentValidInteractionWithBeeSpecies$.pipe(
    map(interactions => interactions.map(({userId, beeSpecies, barcodeValue, isNest}) => ({
      id: userId,
      imgSrc: beeSpecies.asset_urls.art_500_wide,
      scale: beeSpecies.relative_size,
      alt: beeSpecies.name,
      currentFlower: isNest ? 0 : barcodeValue
    })))
  );

  constructor(public teacherRoundService: TeacherRoundService, public timerService: TimerService) { }

  ngOnInit(): void {
  }


}
