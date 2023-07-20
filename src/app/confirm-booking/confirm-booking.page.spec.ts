import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmBookingPage } from './confirm-booking.page';

describe('ConfirmBookingPage', () => {
  let component: ConfirmBookingPage;
  let fixture: ComponentFixture<ConfirmBookingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConfirmBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
