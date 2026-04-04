import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeProfilePictureDialog } from './change-profile-picture-dialog';

describe('ChangeProfilePictureDialog', () => {
  let component: ChangeProfilePictureDialog;
  let fixture: ComponentFixture<ChangeProfilePictureDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeProfilePictureDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeProfilePictureDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
