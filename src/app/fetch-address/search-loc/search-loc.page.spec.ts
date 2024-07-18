import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchLocPage } from './search-loc.page';

describe('SearchLocPage', () => {
  let component: SearchLocPage;
  let fixture: ComponentFixture<SearchLocPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SearchLocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
