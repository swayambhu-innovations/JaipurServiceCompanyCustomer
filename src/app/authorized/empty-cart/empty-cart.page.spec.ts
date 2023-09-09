import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyCartPage } from './empty-cart.page';

describe('EmptyCartPage', () => {
  let component: EmptyCartPage;
  let fixture: ComponentFixture<EmptyCartPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmptyCartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
