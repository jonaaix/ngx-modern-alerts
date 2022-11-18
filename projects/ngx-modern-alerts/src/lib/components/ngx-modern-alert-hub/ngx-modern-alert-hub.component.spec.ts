import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxModernAlertHubComponent } from './ngx-modern-alert-hub.component';

describe('NgxModernAlertHubComponent', () => {
  let component: NgxModernAlertHubComponent;
  let fixture: ComponentFixture<NgxModernAlertHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxModernAlertHubComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxModernAlertHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
