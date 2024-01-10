import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociacaoRegisterLicitacaoComponent } from './associacao-register-licitacao.component';

describe('AssociacaoRegisterLicitacaoComponent', () => {
  let component: AssociacaoRegisterLicitacaoComponent;
  let fixture: ComponentFixture<AssociacaoRegisterLicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociacaoRegisterLicitacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociacaoRegisterLicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
