import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDocument } from './confirm-document';

describe('ConfirmDocument', () => {
  let component: ConfirmDocument;
  let fixture: ComponentFixture<ConfirmDocument>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDocument]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDocument);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
