import { TestBed } from '@angular/core/testing';

import { NgxModernAlertService } from './ngx-modern-alert.service';

describe('NgxModernAlertService', () => {
  let service: NgxModernAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxModernAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
