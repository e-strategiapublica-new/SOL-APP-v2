import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociacaoMapComponent } from './associacao-map.component';

describe('AssociacaoMapComponent', () => {
  let component: AssociacaoMapComponent;
  let fixture: ComponentFixture<AssociacaoMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociacaoMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociacaoMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
