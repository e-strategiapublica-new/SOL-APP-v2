import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSupplier } from './register-supplier-user.component';

describe('RegisterSupplier', () => {
  let component: RegisterSupplier;
  let fixture: ComponentFixture<RegisterSupplier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterSupplier ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterSupplier);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
