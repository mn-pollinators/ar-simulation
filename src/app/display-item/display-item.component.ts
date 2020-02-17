import { Component, OnInit, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Flower } from '../item';
import { trigger, animate, transition, style, keyframes, state} from '@angular/animations';

@Component({
  selector: 'app-display-item',
  templateUrl: './display-item.component.html',
  styleUrls: ['./display-item.component.scss'],
  animations: [
    trigger('active', [
      state('true', style({
        opacity: 1,
      })),
      state('false', style({
        opacity: 0.2,
      })),
      transition('true <=> false', [
        animate(500)
      ])
    ]),

    trigger('position', [
      state('normal', style({
        marginTop: '-{{scale}}%',
        marginLeft: '-{{offset}}%',
        maxWidth: '{{scale}}%',
        maxHeight: '{{scale}}%',
        left: '{{left}}px',
        top: '{{top}}px',
      }), {params: {left: 0, top: 0, scale: 10, offset: 50}}),
      transition('* => normal', [
        animate(0)
      ])
    ]),
  ],
})

export class DisplayItemComponent {

  @Input() flower: Flower;
}