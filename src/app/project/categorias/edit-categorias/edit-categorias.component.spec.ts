import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoriasComponent } from './edit-categorias.component';

describe('EditCategoriasComponent', () => {
  let component: EditCategoriasComponent;
  let fixture: ComponentFixture<EditCategoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCategoriasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
