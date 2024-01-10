import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorContratoSupplierComponent } from './fornecedor-contrato-supplier.component';

describe('FornecedorContratoSupplierComponent', () => {
  let component: FornecedorContratoSupplierComponent;
  let fixture: ComponentFixture<FornecedorContratoSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FornecedorContratoSupplierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedorContratoSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
