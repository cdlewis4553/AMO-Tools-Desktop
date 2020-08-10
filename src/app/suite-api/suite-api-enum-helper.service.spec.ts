import { TestBed } from '@angular/core/testing';

import { SuiteApiEnumHelperService } from './suite-api-enum-helper.service';

describe('SuiteApiEnumHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuiteApiEnumHelperService = TestBed.get(SuiteApiEnumHelperService);
    expect(service).toBeTruthy();
  });
});
