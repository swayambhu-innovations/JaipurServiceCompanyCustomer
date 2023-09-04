import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReschedulePage } from './reschedule.page';

describe('ReschedulePage', () => {
  let component: ReschedulePage;
  let fixture: ComponentFixture<ReschedulePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReschedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
