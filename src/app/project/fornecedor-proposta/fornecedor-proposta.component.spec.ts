import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorPropostaComponent } from './fornecedor-proposta.component';

describe('FornecedorPropostaComponent', () => {
  let component: FornecedorPropostaComponent;
  let fixture: ComponentFixture<FornecedorPropostaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FornecedorPropostaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FornecedorPropostaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
