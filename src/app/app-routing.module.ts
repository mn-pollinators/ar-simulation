import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LargeDisplayComponent } from './pages/large-display/large-display.component';
import { TimerTestComponent } from './test-pages/timer-test/timer-test.component';
import { FlowerTestComponent } from './test-pages/flower-test/flower-test.component';
import { HomeComponent } from './pages/home/home.component';
import { JsonDataTestComponent } from './test-pages/json-data-test/json-data-test.component';
import { SessionTestComponent } from './test-pages/session-test/session-test.component';
import { RoundTemplateTestComponent } from './test-pages/round-template-test/round-template-test.component';
import { JoinSessionComponent } from './pages/join-session/join-session.component';
import { HostSessionComponent } from './pages/host-session/host-session.component';
import { TestPagesComponent } from './pages/test-pages/test-pages.component';
import { AboutComponent } from './pages/about/about.component';
import { FieldGuideTestComponent } from './test-pages/field-guide-test/field-guide-test.component';
import { FieldGuideComponent } from './pages/field-guide/field-guide.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

const testRoutes: Routes = [
  {path: 'timer-test', component: TimerTestComponent},
  {path: 'json-data-test', component: JsonDataTestComponent},
  {path: 'session-test', component: SessionTestComponent},
  {path: 'round-template-test', component: RoundTemplateTestComponent},
  {path: 'flower-test', component: FlowerTestComponent},
  {path: 'field-guide-test', component: FieldGuideTestComponent},
];

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'play', component: JoinSessionComponent},
  {
    path: 'play/:sessionId',
    loadChildren: () => import('./pages/student-display/student-display.module').then(m => m.StudentDisplayModule),
    data: {studentDisplay: true}
  },
  {path: 'host', component: HostSessionComponent},
  {path: 'host/:sessionId', component: LargeDisplayComponent},
  {path: 'field-guide', component: FieldGuideComponent},
  {path: 'about', component: AboutComponent},
  {path: 'test', component: TestPagesComponent},
  {path: 'test', children: testRoutes},
  {path: 'markers', loadChildren: () => import('./pages/marker-generator/marker-generator.module').then(m => m.MarkerGeneratorModule)},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
