import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingEmptyPage } from './booking-empty.page';

describe('BookingEmptyPage', () => {
  let component: BookingEmptyPage;
  let fixture: ComponentFixture<BookingEmptyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BookingEmptyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
