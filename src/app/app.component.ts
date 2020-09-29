import { Component, OnInit } from '@angular/core';
import { buzzAbout as buzzAboutInfo, assets as assetsInfo } from '../../project-info.json';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    console.log(`Buzz About v${buzzAboutInfo.version} (Assets v${assetsInfo.version}) loaded.`);
    console.log(`Commit hash: ${buzzAboutInfo.git.hash}`);
    console.log(`This is a ${environment.production ? 'production' : 'development'} build.`);
  }

}
