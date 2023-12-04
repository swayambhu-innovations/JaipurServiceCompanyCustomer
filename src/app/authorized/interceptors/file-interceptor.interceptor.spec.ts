import { TestBed } from '@angular/core/testing';

import { FileInterceptorInterceptor } from './file-interceptor.interceptor';

describe('FileInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      FileInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: FileInterceptorInterceptor = TestBed.inject(FileInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
