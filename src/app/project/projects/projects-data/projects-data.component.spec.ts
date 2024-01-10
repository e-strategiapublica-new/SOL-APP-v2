import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsDataComponent } from './projects-data.component';

describe('ProjectsDataComponent', () => {
  let component: ProjectsDataComponent;
  let fixture: ComponentFixture<ProjectsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
