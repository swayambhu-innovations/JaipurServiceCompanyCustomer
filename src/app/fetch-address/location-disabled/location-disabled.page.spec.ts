import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationDisabledPage } from './location-disabled.page';

describe('LocationDisabledPage', () => {
  let component: LocationDisabledPage;
  let fixture: ComponentFixture<LocationDisabledPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LocationDisabledPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
