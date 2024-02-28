import { TestBed } from '@angular/core/testing';

import { AutoReloadService } from './auto-reload.service';

describe('AutoReloadService', () => {
  let service: AutoReloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoReloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
