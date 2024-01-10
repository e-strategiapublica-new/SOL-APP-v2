import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUserFornecedorComponent } from './register-user-fornecedor.component';

describe('RegisterUserFornecedorComponent', () => {
  let component: RegisterUserFornecedorComponent;
  let fixture: ComponentFixture<RegisterUserFornecedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterUserFornecedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterUserFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
