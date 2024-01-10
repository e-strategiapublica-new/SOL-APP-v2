import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteClassComponent } from './delete-categorias.component';

describe('DeleteClassComponent', () => {
  let component: DeleteClassComponent;
  let fixture: ComponentFixture<DeleteClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteClassComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
