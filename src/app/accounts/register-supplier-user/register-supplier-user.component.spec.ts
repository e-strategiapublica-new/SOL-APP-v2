import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSupplierUser } from './register-supplier-user.component';

describe('RegisterSupplierUser', () => {
  let component: RegisterSupplierUser;
  let fixture: ComponentFixture<RegisterSupplierUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterSupplierUser ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterSupplierUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
