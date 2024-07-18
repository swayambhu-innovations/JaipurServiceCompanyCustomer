import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FetchAddressPage } from './fetch-address.page';

describe('FetchAddressPage', () => {
  let component: FetchAddressPage;
  let fixture: ComponentFixture<FetchAddressPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FetchAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
