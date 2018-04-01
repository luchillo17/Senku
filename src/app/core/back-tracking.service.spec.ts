import { TestBed, inject } from '@angular/core/testing';

import { BackTrackingService } from './back-tracking.service';

describe('BackTrackingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackTrackingService]
    });
  });

  it('should be created', inject([BackTrackingService], (service: BackTrackingService) => {
    expect(service).toBeTruthy();
  }));
});
