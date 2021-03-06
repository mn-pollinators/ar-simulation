import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerProgressBarComponent } from './timer-progress-bar.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

describe('TimerProgressBarComponent', () => {
  let component: TimerProgressBarComponent;
  let fixture: ComponentFixture<TimerProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimerProgressBarComponent],
      imports: [MatProgressBarModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
