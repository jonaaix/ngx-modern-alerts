import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxModernAlertLayerComponent } from './ngx-modern-alert-layer.component';

describe('NgxModernAlertLayerComponent', () => {
  let component: NgxModernAlertLayerComponent;
  let fixture: ComponentFixture<NgxModernAlertLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxModernAlertLayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxModernAlertLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
