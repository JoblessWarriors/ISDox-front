import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditDepartmentDialog } from './admin-edit-department-dialog';

describe('AdminEditDepartmentDialog', () => {
  let component: AdminEditDepartmentDialog;
  let fixture: ComponentFixture<AdminEditDepartmentDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditDepartmentDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditDepartmentDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
