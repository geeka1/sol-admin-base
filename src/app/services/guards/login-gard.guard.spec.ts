import { TestBed, async, inject } from '@angular/core/testing';

import { LoginGardGuard } from './login-gard.guard';

describe('LoginGardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginGardGuard]
    });
  });

  it('should ...', inject([LoginGardGuard], (guard: LoginGardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
