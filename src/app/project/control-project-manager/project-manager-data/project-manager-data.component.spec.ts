import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerDataComponent } from './project-manager-data.component';

describe('ProjectManagerDataComponent', () => {
  let component: ProjectManagerDataComponent;
  let fixture: ComponentFixture<ProjectManagerDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectManagerDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectManagerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
