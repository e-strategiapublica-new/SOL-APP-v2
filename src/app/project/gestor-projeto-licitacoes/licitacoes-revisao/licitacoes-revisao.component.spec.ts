import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicitacoesRevisaoComponent } from './licitacoes-revisao.component';

describe('LicitacoesRevisaoComponent', () => {
  let component: LicitacoesRevisaoComponent;
  let fixture: ComponentFixture<LicitacoesRevisaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicitacoesRevisaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicitacoesRevisaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
