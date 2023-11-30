import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AuthorizedPage } from './authorized.page';

describe('AuthorizedPage', () => {
  let component: AuthorizedPage;
  let fixture: ComponentFixture<AuthorizedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AuthorizedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
