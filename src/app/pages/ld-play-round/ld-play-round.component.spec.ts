import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdPlayRoundComponent } from './ld-play-round.component';

describe('LdPlayRoundComponent', () => {
  let component: LdPlayRoundComponent;
  let fixture: ComponentFixture<LdPlayRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdPlayRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdPlayRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
