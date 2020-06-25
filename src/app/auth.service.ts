import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, skipWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userCredential: Promise<void | firebase.auth.UserCredential>;

  constructor(public auth: AngularFireAuth) { }

  getCurrentUser$ = this.auth.authState;

  getCurrentUserID$ = this.auth.authState.pipe(
    skipWhile(user => user === null),
    map(user => user.uid)
  );

  logStudentIn() {
    this.userCredential =  this.auth.auth.signInAnonymously().catch((error) => {
      console.error(error);
     });
  }
}
