import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelarLicitacaoComponent } from './cancelar-licitacao.component';

describe('CancelarLicitacaoComponent', () => {
  let component: CancelarLicitacaoComponent;
  let fixture: ComponentFixture<CancelarLicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelarLicitacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelarLicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
