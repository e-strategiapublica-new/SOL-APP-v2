import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerEditComponent } from './project-manager-edit.component';

describe('ProjectManagerEditComponent', () => {
  let component: ProjectManagerEditComponent;
  let fixture: ComponentFixture<ProjectManagerEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectManagerEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectManagerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
