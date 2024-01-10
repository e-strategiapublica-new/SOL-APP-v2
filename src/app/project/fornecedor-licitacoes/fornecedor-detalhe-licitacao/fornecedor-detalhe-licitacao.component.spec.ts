import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorDetalheLicitacaoComponent } from './fornecedor-detalhe-licitacao.component';

describe('FornecedorDetalheLicitacaoComponent', () => {
  let component: FornecedorDetalheLicitacaoComponent;
  let fixture: ComponentFixture<FornecedorDetalheLicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FornecedorDetalheLicitacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedorDetalheLicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
