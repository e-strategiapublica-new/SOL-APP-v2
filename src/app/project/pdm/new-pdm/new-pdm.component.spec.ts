import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPdmComponent } from './new-categorias.component';

describe('NewPdmComponent', () => {
  let component: NewPdmComponent;
  let fixture: ComponentFixture<NewPdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPdmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
