import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectPaymentMethodPage } from './select-payment-method.page';

describe('SelectPaymentMethodPage', () => {
  let component: SelectPaymentMethodPage;
  let fixture: ComponentFixture<SelectPaymentMethodPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SelectPaymentMethodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
