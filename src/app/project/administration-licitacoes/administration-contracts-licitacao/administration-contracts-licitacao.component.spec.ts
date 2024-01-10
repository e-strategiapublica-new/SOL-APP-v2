import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationContractsLicitacaoComponent } from './administration-contracts-licitacao.component';

describe('AdministrationContractsLicitacaoComponent', () => {
  let component: AdministrationContractsLicitacaoComponent;
  let fixture: ComponentFixture<AdministrationContractsLicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrationContractsLicitacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationContractsLicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
