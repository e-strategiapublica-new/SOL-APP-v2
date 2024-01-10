import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAssociacaoComponent } from './control-associacao.component';

describe('ControlAssociacaoComponent', () => {
  let component: ControlAssociacaoComponent;
  let fixture: ComponentFixture<ControlAssociacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlAssociacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlAssociacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
