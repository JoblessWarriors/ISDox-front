import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoxiSearch } from './doxi-search';

describe('DoxiSearch', () => {
  let component: DoxiSearch;
  let fixture: ComponentFixture<DoxiSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoxiSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoxiSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
