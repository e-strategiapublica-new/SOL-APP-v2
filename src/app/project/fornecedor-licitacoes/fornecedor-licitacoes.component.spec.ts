import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorLicitacoesComponent } from './fornecedor-licitacoes.component';

describe('FornecedorLicitacoesComponent', () => {
  let component: FornecedorLicitacoesComponent;
  let fixture: ComponentFixture<FornecedorLicitacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FornecedorLicitacoesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedorLicitacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
