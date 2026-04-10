import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRegister } from './document-register';

describe('DocumentRegister', () => {
  let component: DocumentRegister;
  let fixture: ComponentFixture<DocumentRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
