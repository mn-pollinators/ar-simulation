import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayRoundComponent } from './play-round/play-round.component';
import { LargeDisplayComponent } from './large-display/large-display.component';
import { TimerTestComponent } from './timer-test/timer-test.component';
import { FlowerTestComponent } from './flower-test/flower-test.component';
import { HomeComponent } from './home/home.component';
import { JsonDataTestComponent } from './json-data-test/json-data-test.component';
import { SessionTestComponent } from './session-test/session-test.component';
import { PrepareRoundTestComponent } from './prepare-round-test/prepare-round-test.component';
import { JoinSessionComponent } from './join-session/join-session.component';
import { StudentDisplayComponent } from './student-display/student-display.component';
import { HostSessionComponent } from './host-session/host-session.component';

const testRoutes: Routes = [
  {path: 'timer-test', component: TimerTestComponent},
  {path: 'json-data-test', component: JsonDataTestComponent},
  {path: 'prepare-round-test', component: PrepareRoundTestComponent},
  {path: 'session-test', component: SessionTestComponent},
  {path: 'flower-test', component: FlowerTestComponent}
]

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'play', component: JoinSessionComponent},
  {path: 'play/:sessionId', component: StudentDisplayComponent},
  {path: 'host', component: HostSessionComponent},
  {path: 'host/:sessionId', component: LargeDisplayComponent},
  {path: 'test', children: testRoutes}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
