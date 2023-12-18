import { TestBed } from '@angular/core/testing';

import { AllCategoriesService } from './all-categories.service';

describe('AllCategoriesService', () => {
  let service: AllCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
