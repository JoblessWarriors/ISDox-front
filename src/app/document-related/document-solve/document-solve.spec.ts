import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSolve } from './document-solve';

describe('DocumentSolve', () => {
  let component: DocumentSolve;
  let fixture: ComponentFixture<DocumentSolve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentSolve]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentSolve);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
