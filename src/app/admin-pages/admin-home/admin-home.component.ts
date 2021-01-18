import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AdminService } from 'src/app/services/admin.service';
import { buzzAbout as buzzAboutInfo, assets as assetsInfo } from '../../../../project-info.json';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  buzzAboutInfo = buzzAboutInfo;
  assetsInfo = assetsInfo;

  constructor(public adminService: AdminService, public updates: SwUpdate) { }

  ngOnInit(): void {
  }

  applyUpdate() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }

}
