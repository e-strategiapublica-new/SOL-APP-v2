import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarPropostaModalComponent } from './visualizar-proposta-modal.component';

describe('VisualizarPropostaModalComponent', () => {
  let component: VisualizarPropostaModalComponent;
  let fixture: ComponentFixture<VisualizarPropostaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarPropostaModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarPropostaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
