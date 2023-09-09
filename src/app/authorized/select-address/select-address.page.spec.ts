import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectAddressPage } from './select-address.page';

describe('SelectAddressPage', () => {
  let component: SelectAddressPage;
  let fixture: ComponentFixture<SelectAddressPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SelectAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
