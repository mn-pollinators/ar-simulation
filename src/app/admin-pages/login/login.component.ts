import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public adminService: AdminService, public router: Router) {  }

  ngOnInit(): void {
  }

  signInButton() {
    this.adminService.signIn().then(() => this.router.navigate(['admin']));
  }

}
