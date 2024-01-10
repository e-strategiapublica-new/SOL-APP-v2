import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociacaoLicitacaoComponent } from './associacao-licitacao.component';

describe('AssociacaoLicitacaoComponent', () => {
  let component: AssociacaoLicitacaoComponent;
  let fixture: ComponentFixture<AssociacaoLicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociacaoLicitacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociacaoLicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
