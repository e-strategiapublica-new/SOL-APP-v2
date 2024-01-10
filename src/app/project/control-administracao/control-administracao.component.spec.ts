import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAdministracaoComponent } from './control-administracao.component';

describe('ControlAdministracaoComponent', () => {
  let component: ControlAdministracaoComponent;
  let fixture: ComponentFixture<ControlAdministracaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlAdministracaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlAdministracaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
