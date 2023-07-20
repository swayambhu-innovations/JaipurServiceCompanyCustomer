import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderPlacedPage } from './order-placed.page';

describe('OrderPlacedPage', () => {
  let component: OrderPlacedPage;
  let fixture: ComponentFixture<OrderPlacedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OrderPlacedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
