import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerConveniosComponent } from './project-manager-convenios.component';

describe('ProjectManagerConveniosComponent', () => {
  let component: ProjectManagerConveniosComponent;
  let fixture: ComponentFixture<ProjectManagerConveniosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectManagerConveniosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectManagerConveniosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
