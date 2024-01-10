import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociacaoConvenioDataComponent } from './associacao-convenio-data.component';

describe('AssociacaoConvenioDataComponent', () => {
  let component: AssociacaoConvenioDataComponent;
  let fixture: ComponentFixture<AssociacaoConvenioDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociacaoConvenioDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociacaoConvenioDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
