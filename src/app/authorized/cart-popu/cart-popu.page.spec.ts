import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartPopuPage } from '../cart-popu/cart-popu.page';

describe('CartPage', () => {
  let component: CartPopuPage;
  let fixture: ComponentFixture<CartPopuPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CartPopuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
