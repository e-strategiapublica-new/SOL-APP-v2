import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContractModalComponent } from './update-contract-modal.component';

describe('UpdateContractModalComponent', () => {
  let component: UpdateContractModalComponent;
  let fixture: ComponentFixture<UpdateContractModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateContractModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateContractModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
