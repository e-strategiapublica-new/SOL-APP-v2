import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociacaoConveniosComponent } from './associacao-convenios.component';

describe('AssociacaoConveniosComponent', () => {
  let component: AssociacaoConveniosComponent;
  let fixture: ComponentFixture<AssociacaoConveniosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociacaoConveniosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociacaoConveniosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
