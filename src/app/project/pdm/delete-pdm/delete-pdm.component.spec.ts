import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePdmComponent } from './delete-categorias.component';

describe('DeletePdmComponent', () => {
  let component: DeletePdmComponent;
  let fixture: ComponentFixture<DeletePdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePdmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
