import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFornecedorComponent } from './update-fornecedor.component';

describe('UpdateFornecedorComponent', () => {
  let component: UpdateFornecedorComponent;
  let fixture: ComponentFixture<UpdateFornecedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateFornecedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
