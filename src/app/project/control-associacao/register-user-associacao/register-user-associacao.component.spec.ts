import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUserAssociacaoComponent } from './register-user-associacao.component';

describe('RegisterUserAssociacaoComponent', () => {
  let component: RegisterUserAssociacaoComponent;
  let fixture: ComponentFixture<RegisterUserAssociacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterUserAssociacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterUserAssociacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
