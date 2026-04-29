import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolveDossierDialog } from './solve-dossier-dialog';

describe('SolveDossierDialog', () => {
  let component: SolveDossierDialog;
  let fixture: ComponentFixture<SolveDossierDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolveDossierDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolveDossierDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
