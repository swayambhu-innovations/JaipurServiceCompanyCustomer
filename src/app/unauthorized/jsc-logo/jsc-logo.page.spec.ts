import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JscLogoPage } from './jsc-logo.page';

describe('JscLogoPage', () => {
  let component: JscLogoPage;
  let fixture: ComponentFixture<JscLogoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JscLogoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
