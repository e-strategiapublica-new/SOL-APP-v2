import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterProjectManagerComponent } from './register-project-manager.component';

describe('RegisterProjectManagerComponent', () => {
  let component: RegisterProjectManagerComponent;
  let fixture: ComponentFixture<RegisterProjectManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterProjectManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterProjectManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
