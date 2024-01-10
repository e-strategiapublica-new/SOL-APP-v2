import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecusarLicitacaoComponent } from './recusar-licitacao.component';

describe('RecusarLicitacaoComponent', () => {
  let component: RecusarLicitacaoComponent;
  let fixture: ComponentFixture<RecusarLicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecusarLicitacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecusarLicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
