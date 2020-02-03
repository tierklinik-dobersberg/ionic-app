import { TestBed } from '@angular/core/testing';

import { DxrService } from './dxr.service';

describe('DxrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DxrService = TestBed.get(DxrService);
    expect(service).toBeTruthy();
  });
});
