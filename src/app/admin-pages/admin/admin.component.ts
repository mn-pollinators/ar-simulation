import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(public adminService: AdminService, public router: Router) { }

  ngOnInit(): void {
  }

  signOutButton() {
    this.adminService.signOut().then(() => this.router.navigate(['admin', 'login']));
  }

}
