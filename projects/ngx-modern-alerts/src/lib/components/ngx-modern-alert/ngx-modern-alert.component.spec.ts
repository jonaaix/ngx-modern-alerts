import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxModernAlertComponent } from './ngx-modern-alert.component';

describe('NgxModernAlertComponent', () => {
  let component: NgxModernAlertComponent;
  let fixture: ComponentFixture<NgxModernAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxModernAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxModernAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
