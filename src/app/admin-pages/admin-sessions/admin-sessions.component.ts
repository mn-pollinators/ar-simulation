import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-sessions',
  templateUrl: './admin-sessions.component.html',
  styleUrls: ['./admin-sessions.component.scss']
})
export class AdminSessionsComponent implements OnInit {

  constructor(public adminService: AdminService) { }

  sessions$ = this.adminService.getRecentSessions();

  ngOnInit(): void {
  }

}
