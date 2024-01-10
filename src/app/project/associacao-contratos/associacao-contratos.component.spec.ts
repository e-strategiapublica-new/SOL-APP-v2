import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociacaoContratosComponent } from './associacao-contratos.component';

describe('AssociacaoContratosComponent', () => {
  let component: AssociacaoContratosComponent;
  let fixture: ComponentFixture<AssociacaoContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociacaoContratosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociacaoContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
