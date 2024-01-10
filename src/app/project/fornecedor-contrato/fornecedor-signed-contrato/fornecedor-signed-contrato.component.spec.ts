import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorSignedContratoComponent } from './fornecedor-signed-contrato.component';

describe('FornecedorSignedContratoComponent', () => {
  let component: FornecedorSignedContratoComponent;
  let fixture: ComponentFixture<FornecedorSignedContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FornecedorSignedContratoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedorSignedContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
