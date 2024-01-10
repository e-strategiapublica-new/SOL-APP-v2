import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDataAdministracaoComponent } from './user-data-administracao.component';

describe('UserDataAdministracaoComponent', () => {
  let component: UserDataAdministracaoComponent;
  let fixture: ComponentFixture<UserDataAdministracaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDataAdministracaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDataAdministracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
