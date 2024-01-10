import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPDMComponent } from './edit-categorias.component';

describe('EditPDMComponent', () => {
  let component: EditPDMComponent;
  let fixture: ComponentFixture<EditPDMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPDMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPDMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
