import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlFornecedorComponent } from './control-fornecedor.component';

describe('ControlFornecedorComponent', () => {
  let component: ControlFornecedorComponent;
  let fixture: ComponentFixture<ControlFornecedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlFornecedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
