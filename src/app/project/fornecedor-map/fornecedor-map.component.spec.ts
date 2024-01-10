import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorMapComponent } from './fornecedor-map.component';

describe('FornecedorMapComponent', () => {
  let component: FornecedorMapComponent;
  let fixture: ComponentFixture<FornecedorMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FornecedorMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedorMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
