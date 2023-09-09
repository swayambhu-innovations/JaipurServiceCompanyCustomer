import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoNotificationPage } from './no-notification.page';

describe('NoNotificationPage', () => {
  let component: NoNotificationPage;
  let fixture: ComponentFixture<NoNotificationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NoNotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
