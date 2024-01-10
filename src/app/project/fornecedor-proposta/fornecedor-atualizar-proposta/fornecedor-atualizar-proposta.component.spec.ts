import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorAtualizarPropostaComponent } from './fornecedor-atualizar-proposta.component';

describe('FornecedorAtualizarPropostaComponent', () => {
  let component: FornecedorAtualizarPropostaComponent;
  let fixture: ComponentFixture<FornecedorAtualizarPropostaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FornecedorAtualizarPropostaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedorAtualizarPropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
