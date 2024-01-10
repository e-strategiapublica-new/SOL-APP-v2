import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteFornecedorComponent } from './delete-fornecedor.component';


describe('DeleteFornecedorComponent', () => {
  let component: DeleteFornecedorComponent;
  let fixture: ComponentFixture<DeleteFornecedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteFornecedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
