import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { SharedModule } from '../shared.module';
import { LoginComponent } from './login/login.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminSessionsComponent } from './admin-sessions/admin-sessions.component';


const ANGULAR_MATERIAL_MODULES = [
  MatToolbarModule
];

@NgModule({
  declarations: [
    AdminComponent,
    LoginComponent,
    AdminHomeComponent,
    AdminSessionsComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    ANGULAR_MATERIAL_MODULES
  ]
})
export class AdminModule { }
