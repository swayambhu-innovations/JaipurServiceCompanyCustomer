import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpcomingHistoryPage } from './upcoming-history.page';

describe('UpcomingHistoryPage', () => {
  let component: UpcomingHistoryPage;
  let fixture: ComponentFixture<UpcomingHistoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpcomingHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
