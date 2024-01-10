import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserAdministracaoComponent } from './update-user-administracao.component';

describe('UpdateUserAdministracaoComponent', () => {
  let component: UpdateUserAdministracaoComponent;
  let fixture: ComponentFixture<UpdateUserAdministracaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserAdministracaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateUserAdministracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
