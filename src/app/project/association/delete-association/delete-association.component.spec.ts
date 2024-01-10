import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAssociationComponent } from './delete-association.component';

describe('DeleteAssociationComponent', () => {
  let component: DeleteAssociationComponent;
  let fixture: ComponentFixture<DeleteAssociationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteAssociationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
