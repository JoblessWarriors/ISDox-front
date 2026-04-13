import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveArchiveLabelsDialog } from './save-archive-labels-dialog';

describe('SaveArchiveLabelsDialog', () => {
  let component: SaveArchiveLabelsDialog;
  let fixture: ComponentFixture<SaveArchiveLabelsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveArchiveLabelsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveArchiveLabelsDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
