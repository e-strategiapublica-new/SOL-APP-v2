import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPasswordFirstAccessComponent } from './register-password-first-access.component';

describe('RegisterPasswordFirstAccessComponent', () => {
  let component: RegisterPasswordFirstAccessComponent;
  let fixture: ComponentFixture<RegisterPasswordFirstAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterPasswordFirstAccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPasswordFirstAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
