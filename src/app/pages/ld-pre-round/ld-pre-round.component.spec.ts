import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdPreRoundComponent } from './ld-pre-round.component';

describe('LdPreRoundComponent', () => {
  let component: LdPreRoundComponent;
  let fixture: ComponentFixture<LdPreRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdPreRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdPreRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
