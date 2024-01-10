import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorContratoComponent } from './fornecedor-contrato.component';

describe('FornecedorContratoComponent', () => {
  let component: FornecedorContratoComponent;
  let fixture: ComponentFixture<FornecedorContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FornecedorContratoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedorContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
