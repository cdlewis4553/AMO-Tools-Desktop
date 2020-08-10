import { TestBed } from '@angular/core/testing';

import { FansApiService } from './fans-api.service';

describe('FansApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FansApiService = TestBed.get(FansApiService);
    expect(service).toBeTruthy();
  });
});
