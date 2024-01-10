import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserAssociacaoComponent } from './update-user-associacao.component';

describe('UpdateUserAssociacaoComponent', () => {
  let component: UpdateUserAssociacaoComponent;
  let fixture: ComponentFixture<UpdateUserAssociacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserAssociacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateUserAssociacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
