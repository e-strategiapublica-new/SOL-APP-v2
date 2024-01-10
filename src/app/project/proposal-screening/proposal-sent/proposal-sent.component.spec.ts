import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalSentComponent } from './proposal-sent.component';

describe('ProposalSentComponent', () => {
  let component: ProposalSentComponent;
  let fixture: ComponentFixture<ProposalSentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalSentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
