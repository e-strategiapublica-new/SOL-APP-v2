import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationSetTimeComponent } from './administration-set-time.component';

describe('AdministrationSetTimeComponent', () => {
  let component: AdministrationSetTimeComponent;
  let fixture: ComponentFixture<AdministrationSetTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrationSetTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationSetTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
