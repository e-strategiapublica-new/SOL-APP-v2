import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewContractTemplatesComponent } from './new-contract-templates.component';

describe('NewContractTemplatesComponent', () => {
  let component: NewContractTemplatesComponent;
  let fixture: ComponentFixture<NewContractTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewContractTemplatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewContractTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
