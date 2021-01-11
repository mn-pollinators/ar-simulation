import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, SETTINGS as FIRESTORE_SETTINGS } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { LargeDisplayComponent } from './pages/large-display/large-display.component';
import { TimerTestComponent } from './test-pages/timer-test/timer-test.component';
import { TimerProgressBarComponent } from './components/timer-progress-bar/timer-progress-bar.component';
import { TimerProgressSpinnerComponent } from './components/timer-progress-spinner/timer-progress-spinner.component';
import { FlowerLayoutComponent } from './components/flower-layout/flower-layout.component';
import { FlowerLayoutItemComponent } from './components/flower-layout-item/flower-layout-item.component';
import { FlowerTestComponent } from './test-pages/flower-test/flower-test.component';
import { HomeComponent } from './pages/home/home.component';
import { JsonDataTestComponent } from './test-pages/json-data-test/json-data-test.component';
import {
  ConfirmRemoveStudentDialogComponent,
  JoinedStudentsComponent,
  RenameStudentDialogComponent
} from './components/joined-students/joined-students.component';
import { SessionTestComponent } from './test-pages/session-test/session-test.component';
import { JoinSessionComponent } from './pages/join-session/join-session.component';
import { PrepareRoundTestComponent } from './test-pages/prepare-round-test/prepare-round-test.component';
import { SessionLobbyComponent } from './pages/session-lobby/session-lobby.component';
import { BottomBarComponent } from './components/bottom-bar/bottom-bar.component';
import { HostSessionComponent } from './pages/host-session/host-session.component';
import { RoundTemplateTestComponent } from './test-pages/round-template-test/round-template-test.component';
import { TestPagesComponent } from './pages/test-pages/test-pages.component';
import { RoundChooserDialogComponent } from './components/round-chooser-dialog/round-chooser-dialog.component';
import { AboutComponent } from './pages/about/about.component';
import { SharedModule } from './shared.module';
import { RoundMonitorComponent } from './test-pages/round-monitor/round-monitor.component';


const FIREBASE_MODULES = [
  AngularFireModule.initializeApp(environment.firebase),
  AngularFirestoreModule,
  AngularFireAuthModule
];

@NgModule({
  declarations: [
    AppComponent,
    LargeDisplayComponent,
    TimerTestComponent,
    TimerProgressBarComponent,
    TimerProgressSpinnerComponent,
    FlowerLayoutComponent,
    FlowerLayoutItemComponent,
    FlowerTestComponent,
    HomeComponent,
    JsonDataTestComponent,
    JoinedStudentsComponent,
    SessionTestComponent,
    JoinSessionComponent,
    PrepareRoundTestComponent,
    BottomBarComponent,
    SessionLobbyComponent,
    HostSessionComponent,
    RoundTemplateTestComponent,
    TestPagesComponent,
    RoundChooserDialogComponent,
    AboutComponent,
    ConfirmRemoveStudentDialogComponent,
    RenameStudentDialogComponent,
    RoundMonitorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FIREBASE_MODULES,
    SharedModule
  ],
  providers: [
    {
      provide: FIRESTORE_SETTINGS,
      useValue: environment.firestoreSettings,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
