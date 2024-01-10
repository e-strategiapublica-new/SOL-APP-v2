import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FracassarLicitacaoComponent } from './fracassar-licitacao.component';

describe('FracassarLicitacaoComponent', () => {
  let component: FracassarLicitacaoComponent;
  let fixture: ComponentFixture<FracassarLicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FracassarLicitacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FracassarLicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
