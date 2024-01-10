import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationDataComponent } from './association-data.component';

describe('AssociationDataComponent', () => {
  let component: AssociationDataComponent;
  let fixture: ComponentFixture<AssociationDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociationDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
