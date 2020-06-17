import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerTestComponent } from './flower-test.component';
import { FlowerLayoutComponent } from '../flower-layout/flower-layout.component';
import { FlowerLayoutItemComponent } from '../flower-layout-item/flower-layout-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MdcIconModule, MdcTopAppBarModule } from '@angular-mdc/web';
import { TopMenuBarComponent } from '../top-menu-bar/top-menu-bar.component';
import { FullscreenButtonComponent } from '../fullscreen-button/fullscreen-button.component';

describe('FlowerTestComponent', () => {
  let component: FlowerTestComponent;
  let fixture: ComponentFixture<FlowerTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MdcIconModule,
        MdcTopAppBarModule,
        BrowserAnimationsModule,
        FormsModule,
      ],
      declarations: [
        FlowerTestComponent,
        FlowerLayoutComponent,
        FlowerLayoutItemComponent,
        TopMenuBarComponent,
        FullscreenButtonComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});