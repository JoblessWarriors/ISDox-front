import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateDialog } from './admin-create-dialog';

describe('AdminCreateDialog', () => {
  let component: AdminCreateDialog;
  let fixture: ComponentFixture<AdminCreateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCreateDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
