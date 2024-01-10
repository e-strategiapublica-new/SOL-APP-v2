import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociacaoLicitacaoDataComponent } from './associacao-licitacao-data.component';

describe('AssociacaoLicitacaoDataComponent', () => {
  let component: AssociacaoLicitacaoDataComponent;
  let fixture: ComponentFixture<AssociacaoLicitacaoDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociacaoLicitacaoDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociacaoLicitacaoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
