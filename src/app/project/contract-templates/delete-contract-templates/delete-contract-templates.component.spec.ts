import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteContractTemplatesComponent } from './delete-contract-templates.component';

describe('DeleteContractTemplatesComponent', () => {
  let component: DeleteContractTemplatesComponent;
  let fixture: ComponentFixture<DeleteContractTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteContractTemplatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteContractTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
