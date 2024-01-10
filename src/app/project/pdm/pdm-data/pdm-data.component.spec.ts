import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdmDataComponent } from './association-data.component';

describe('PdmDataComponent', () => {
  let component: PdmDataComponent;
  let fixture: ComponentFixture<PdmDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdmDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdmDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
