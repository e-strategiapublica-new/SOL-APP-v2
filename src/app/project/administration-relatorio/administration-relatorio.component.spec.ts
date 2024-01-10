import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationRelatorioComponent } from './administration-relatorio.component';

describe('AdministrationRelatorioComponent', () => {
  let component: AdministrationRelatorioComponent;
  let fixture: ComponentFixture<AdministrationRelatorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrationRelatorioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationRelatorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
