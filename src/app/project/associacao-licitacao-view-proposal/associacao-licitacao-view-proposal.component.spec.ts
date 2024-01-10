import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociacaoLicitacaoViewProposalComponent } from './associacao-licitacao-view-proposal.component';

describe('AssociacaoLicitacaoViewProposalComponent', () => {
  let component: AssociacaoLicitacaoViewProposalComponent;
  let fixture: ComponentFixture<AssociacaoLicitacaoViewProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociacaoLicitacaoViewProposalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociacaoLicitacaoViewProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
