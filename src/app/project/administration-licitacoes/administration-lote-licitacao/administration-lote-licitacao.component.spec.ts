import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationLoteLicitacaoComponent } from './administration-lote-licitacao.component';

describe('AdministrationLoteLicitacaoComponent', () => {
  let component: AdministrationLoteLicitacaoComponent;
  let fixture: ComponentFixture<AdministrationLoteLicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrationLoteLicitacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationLoteLicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
