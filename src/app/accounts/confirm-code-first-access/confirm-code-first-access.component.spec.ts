import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCodeFirstAcessComponent } from './confirm-code-first-access.component';

describe('ConfirmCodeFirstAcessComponent', () => {
  let component: ConfirmCodeFirstAcessComponent;
  let fixture: ComponentFixture<ConfirmCodeFirstAcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmCodeFirstAcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmCodeFirstAcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
