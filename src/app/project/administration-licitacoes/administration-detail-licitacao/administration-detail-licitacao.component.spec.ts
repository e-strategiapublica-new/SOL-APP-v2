import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationDetailLicitacaoComponent } from './administration-detail-licitacao.component';

describe('AdministrationDetailLicitacaoComponent', () => {
  let component: AdministrationDetailLicitacaoComponent;
  let fixture: ComponentFixture<AdministrationDetailLicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrationDetailLicitacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationDetailLicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
