import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLangAuthComponent } from './change-lang-auth.component';

describe('ChangeLangAuthComponent', () => {
  let component: ChangeLangAuthComponent;
  let fixture: ComponentFixture<ChangeLangAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeLangAuthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeLangAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
