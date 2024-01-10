import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContractTemplatesComponent } from './edit-contract-templates.component';

describe('EditContractTemplatesComponent', () => {
  let component: EditContractTemplatesComponent;
  let fixture: ComponentFixture<EditContractTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditContractTemplatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditContractTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
