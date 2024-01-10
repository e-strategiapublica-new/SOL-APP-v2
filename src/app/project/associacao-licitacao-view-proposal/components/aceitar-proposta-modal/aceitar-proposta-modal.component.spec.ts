import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceitarPropostaModalComponent } from './aceitar-proposta-modal.component';

describe('AceitarPropostaModalComponent', () => {
  let component: AceitarPropostaModalComponent;
  let fixture: ComponentFixture<AceitarPropostaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AceitarPropostaModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceitarPropostaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
