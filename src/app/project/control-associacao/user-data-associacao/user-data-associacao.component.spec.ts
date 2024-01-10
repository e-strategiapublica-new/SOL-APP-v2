import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDataAssociacaoComponent } from './user-data-associacao.component';

describe('UserDataAssociacaoComponent', () => {
  let component: UserDataAssociacaoComponent;
  let fixture: ComponentFixture<UserDataAssociacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDataAssociacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDataAssociacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
