import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewConvenioComponent } from './new-convenio.component';

describe('NewConvenioComponent', () => {
  let component: NewConvenioComponent;
  let fixture: ComponentFixture<NewConvenioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewConvenioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewConvenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
