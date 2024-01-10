import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConvenioComponent } from './edit-convenio.component';

describe('EditConvenioComponent', () => {
  let component: EditConvenioComponent;
  let fixture: ComponentFixture<EditConvenioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConvenioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditConvenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
