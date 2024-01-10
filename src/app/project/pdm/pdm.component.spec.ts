import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PDMComponent } from './categorias.component';

describe('PDMComponent', () => {
  let component: PDMComponent;
  let fixture: ComponentFixture<PDMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PDMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PDMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
