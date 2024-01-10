import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociacaoEditLicitacaoComponent } from './associacao-edit-licitacao.component';

describe('AssociacaoEditLicitacaoComponent', () => {
  let component: AssociacaoEditLicitacaoComponent;
  let fixture: ComponentFixture<AssociacaoEditLicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociacaoEditLicitacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociacaoEditLicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
