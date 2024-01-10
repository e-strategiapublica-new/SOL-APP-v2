import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalAcceptedComponent } from './proposal-accepted.component';

describe('ProposalAcceptedComponent', () => {
  let component: ProposalAcceptedComponent;
  let fixture: ComponentFixture<ProposalAcceptedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalAcceptedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
