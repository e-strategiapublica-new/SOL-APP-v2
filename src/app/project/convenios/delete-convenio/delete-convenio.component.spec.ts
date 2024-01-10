import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConvenioComponent } from './delete-convenio.component';

describe('DeleteConvenioComponent', () => {
  let component: DeleteConvenioComponent;
  let fixture: ComponentFixture<DeleteConvenioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteConvenioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteConvenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
