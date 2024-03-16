import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TncPage } from './tnc.page';

describe('TncPage', () => {
  let component: TncPage;
  let fixture: ComponentFixture<TncPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TncPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
