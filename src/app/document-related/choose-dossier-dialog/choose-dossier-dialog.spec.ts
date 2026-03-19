import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDossierDialog } from './choose-dossier-dialog';

describe('ChooseDossierDialog', () => {
  let component: ChooseDossierDialog;
  let fixture: ComponentFixture<ChooseDossierDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseDossierDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseDossierDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
