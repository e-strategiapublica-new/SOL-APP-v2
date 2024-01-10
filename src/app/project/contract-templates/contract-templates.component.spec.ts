import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractTemplatesComponent } from './contract-templates.component';

describe('ContractTemplatesComponent', () => {
  let component: ContractTemplatesComponent;
  let fixture: ComponentFixture<ContractTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractTemplatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
