import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReferAfriendPage } from './refer-afriend.page';

describe('ReferAfriendPage', () => {
  let component: ReferAfriendPage;
  let fixture: ComponentFixture<ReferAfriendPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReferAfriendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
