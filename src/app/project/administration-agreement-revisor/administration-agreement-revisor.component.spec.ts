import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationAgreementRevisorComponent } from './administration-agreement-revisor.component';

describe('AdministrationAgreementRevisorComponent', () => {
  let component: AdministrationAgreementRevisorComponent;
  let fixture: ComponentFixture<AdministrationAgreementRevisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrationAgreementRevisorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationAgreementRevisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
