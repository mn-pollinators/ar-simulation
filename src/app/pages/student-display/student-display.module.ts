import { NgModule } from '@angular/core';

import { StudentDisplayRoutingModule } from './student-display-routing.module';
import { StudentDisplayComponent } from './student-display.component';
import { SharedModule } from 'src/app/shared.module';
import { ArViewComponent } from 'src/app/components/ar-view/ar-view.component';
import { PlayRoundComponent } from 'src/app/components/play-round/play-round.component';
import { StudentRoundComponent } from 'src/app/components/student-round/student-round.component';


const studentComponents = [
  StudentRoundComponent,
  PlayRoundComponent,
  ArViewComponent
];

@NgModule({
  declarations: [
    ...studentComponents,
    StudentDisplayComponent
  ],
  imports: [
    SharedModule,
    StudentDisplayRoutingModule
  ]
})
export class StudentDisplayModule { }
