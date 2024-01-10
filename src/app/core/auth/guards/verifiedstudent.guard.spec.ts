import { TestBed } from '@angular/core/testing';

import { VerifiedstudentGuard } from './verifiedstudent.guard';

describe('VerifiedstudentGuard', () => {
  let guard: VerifiedstudentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VerifiedstudentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
