import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpsMapPage } from './gps-map.page';

describe('GpsMapPage', () => {
  let component: GpsMapPage;
  let fixture: ComponentFixture<GpsMapPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GpsMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
