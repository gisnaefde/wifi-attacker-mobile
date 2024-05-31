import { TestBed } from '@angular/core/testing';

import { ShowHideContentService } from './show-hide-content.service';

describe('ShowHideContentService', () => {
  let service: ShowHideContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowHideContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
