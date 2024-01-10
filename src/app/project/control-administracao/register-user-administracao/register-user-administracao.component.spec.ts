import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUserAdministracaoComponent } from './register-user-administracao.component';

describe('RegisterUserAdministracaoComponent', () => {
  let component: RegisterUserAdministracaoComponent;
  let fixture: ComponentFixture<RegisterUserAdministracaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterUserAdministracaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterUserAdministracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
