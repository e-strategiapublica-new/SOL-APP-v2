import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConvenioResponseDto } from 'src/dtos/convenio/convenio-response.dto';
import { ProjectGetResponseDto } from 'src/dtos/projects/project-get-response.dto';
import { ProjectsService } from 'src/services/projects.service';

@Component({
  selector: 'app-projects-data',
  templateUrl: './projects-data.component.html',
  styleUrls: ['./projects-data.component.scss']
})
export class ProjectsDataComponent implements OnInit {

  projects: ProjectGetResponseDto;
  convenios: ConvenioResponseDto[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.projectsService.getProjectById(params['_id']).subscribe({
        next: (success) => {
          this.projects = success;
          console.log(success)
          this.convenios = success.agreement_list;
        },
        error: (error) => {
          console.error(error);
        }
      });
    });
  }

}
