import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosConvenioComponent } from './dados-convenio.component';

describe('DadosConvenioComponent', () => {
  let component: DadosConvenioComponent;
  let fixture: ComponentFixture<DadosConvenioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DadosConvenioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DadosConvenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
