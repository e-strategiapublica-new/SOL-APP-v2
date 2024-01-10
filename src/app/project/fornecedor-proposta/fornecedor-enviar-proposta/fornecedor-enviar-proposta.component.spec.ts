import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorEnviarPropostaComponent } from './fornecedor-enviar-proposta.component';

describe('FornecedorEnviarPropostaComponent', () => {
  let component: FornecedorEnviarPropostaComponent;
  let fixture: ComponentFixture<FornecedorEnviarPropostaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FornecedorEnviarPropostaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedorEnviarPropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
