import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdPostRoundComponent } from './ld-post-round.component';

describe('LdPostRoundComponent', () => {
  let component: LdPostRoundComponent;
  let fixture: ComponentFixture<LdPostRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdPostRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdPostRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
