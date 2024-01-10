import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDataFornecedorComponent } from './user-data-fornecedor.component';

describe('UserDataFornecedorComponent', () => {
  let component: UserDataFornecedorComponent;
  let fixture: ComponentFixture<UserDataFornecedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDataFornecedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDataFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
