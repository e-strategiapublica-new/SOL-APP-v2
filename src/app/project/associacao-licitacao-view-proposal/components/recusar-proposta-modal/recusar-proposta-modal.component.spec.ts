import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecusarPropostaModalComponent } from './recusar-proposta-modal.component';

describe('RecusarPropostaModalComponent', () => {
  let component: RecusarPropostaModalComponent;
  let fixture: ComponentFixture<RecusarPropostaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecusarPropostaModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecusarPropostaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
