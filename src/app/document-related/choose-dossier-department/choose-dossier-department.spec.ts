import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDossierDepartment } from './choose-dossier-department';

describe('ChooseDossierDepartment', () => {
  let component: ChooseDossierDepartment;
  let fixture: ComponentFixture<ChooseDossierDepartment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseDossierDepartment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseDossierDepartment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
