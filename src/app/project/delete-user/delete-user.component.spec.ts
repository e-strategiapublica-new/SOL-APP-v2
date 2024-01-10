import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserAssociacaoComponent } from './delete-user.component';

describe('DeleteUserAssociacaoComponent', () => {
  let component: DeleteUserAssociacaoComponent;
  let fixture: ComponentFixture<DeleteUserAssociacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteUserAssociacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteUserAssociacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
