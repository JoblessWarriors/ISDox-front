import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentLayout } from './document-layout';

describe('DocumentLayout', () => {
  let component: DocumentLayout;
  let fixture: ComponentFixture<DocumentLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
