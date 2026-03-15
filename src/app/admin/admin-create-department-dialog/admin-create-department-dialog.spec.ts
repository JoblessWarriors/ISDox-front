import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateDepartmentDialog } from './admin-create-department-dialog';

describe('AdminCreateDepartmentDialog', () => {
  let component: AdminCreateDepartmentDialog;
  let fixture: ComponentFixture<AdminCreateDepartmentDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateDepartmentDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCreateDepartmentDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
