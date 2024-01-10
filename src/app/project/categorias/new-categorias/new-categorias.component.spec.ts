import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCategoriasComponent } from './new-categorias.component';

describe('NewCategoriasComponent', () => {
  let component: NewCategoriasComponent;
  let fixture: ComponentFixture<NewCategoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCategoriasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
