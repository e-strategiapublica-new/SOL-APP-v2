import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociacaoContratosDataComponent } from './associacao-contratos-data.component';

describe('AssociacaoContratosDataComponent', () => {
  let component: AssociacaoContratosDataComponent;
  let fixture: ComponentFixture<AssociacaoContratosDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociacaoContratosDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociacaoContratosDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
