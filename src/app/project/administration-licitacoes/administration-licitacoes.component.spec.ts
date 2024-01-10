import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationLicitacoesComponent } from './administration-licitacoes.component';

describe('AdministrationLicitacoesComponent', () => {
  let component: AdministrationLicitacoesComponent;
  let fixture: ComponentFixture<AdministrationLicitacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrationLicitacoesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationLicitacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
