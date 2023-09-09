import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectSlotPage } from './select-slot.page';

describe('SelectSlotPage', () => {
  let component: SelectSlotPage;
  let fixture: ComponentFixture<SelectSlotPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SelectSlotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
