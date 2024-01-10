import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicitacoesVisualizacaoComponent } from './licitacoes-visualizacao.component';

describe('LicitacoesVisualizacaoComponent', () => {
  let component: LicitacoesVisualizacaoComponent;
  let fixture: ComponentFixture<LicitacoesVisualizacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicitacoesVisualizacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicitacoesVisualizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
