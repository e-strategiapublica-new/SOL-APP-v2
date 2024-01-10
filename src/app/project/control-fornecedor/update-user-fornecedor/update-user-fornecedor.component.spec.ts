import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserFornecedorComponent } from './update-user-fornecedor.component';

describe('UpdateUserFornecedorComponent', () => {
  let component: UpdateUserFornecedorComponent;
  let fixture: ComponentFixture<UpdateUserFornecedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserFornecedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateUserFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
