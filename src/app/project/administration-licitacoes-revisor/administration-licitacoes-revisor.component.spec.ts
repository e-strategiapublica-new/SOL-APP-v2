import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationLicitacoesRevisorComponent } from './administration-licitacoes-revisor.component';

describe('AdministrationLicitacoesRevisorComponent', () => {
  let component: AdministrationLicitacoesRevisorComponent;
  let fixture: ComponentFixture<AdministrationLicitacoesRevisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrationLicitacoesRevisorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationLicitacoesRevisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
