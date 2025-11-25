import { TestBed } from '@angular/core/testing';

import { GestionApi } from './gestion-api';

describe('GestionApi', () => {
  let service: GestionApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
