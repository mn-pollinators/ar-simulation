import { Component, OnInit } from '@angular/core';
import { buzzAbout as buzzAboutInfo, assets as assetsInfo } from '../../../../project-info.json';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  buzzAboutInfo = buzzAboutInfo;
  assetsInfo = assetsInfo;

  buzzAboutContributors = buzzAboutInfo.contributors.filter(c => c.type !== 'Bot');
  assetsContributors = assetsInfo.contributors.filter(c => c.type !== 'Bot');

  allContributors = this.buzzAboutContributors.concat(
    // Only add assets contributors who aren't already in the list of Buzz
    // About contributors.
    this.assetsContributors.filter(x => !this.buzzAboutContributors.some(y => x.username === y.username))
  );

  constructor() {
  }

  ngOnInit(): void {
  }

}
