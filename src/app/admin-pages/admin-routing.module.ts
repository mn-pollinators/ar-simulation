import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';

import { AngularFireAuthGuard, canActivate, customClaims, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminSessionsComponent } from './admin-sessions/admin-sessions.component';

const adminOnly = () =>  pipe(customClaims, map(claims => claims.admin ? true : ['admin', 'login']));
const adminRedirect = () => pipe(customClaims, map(claims => claims.admin ? ['admin'] : true));

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    ...canActivate(adminOnly),
    children: [
      { path: '', component: AdminHomeComponent },
      { path: 'sessions', component: AdminSessionsComponent}
    ]
  },
  { path: 'login', component: LoginComponent, ...canActivate(adminRedirect) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
