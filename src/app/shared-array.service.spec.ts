import { TestBed } from '@angular/core/testing';

import { SharedArrayService } from './shared-array.service';

describe('SharedArrayService', () => {
  let service: SharedArrayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedArrayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
