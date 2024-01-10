import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCategoriasComponent } from './delete-categorias.component';

describe('DeleteCategoriasComponent', () => {
  let component: DeleteCategoriasComponent;
  let fixture: ComponentFixture<DeleteCategoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteCategoriasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
