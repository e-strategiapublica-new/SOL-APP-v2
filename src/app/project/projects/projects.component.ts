import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteProjectComponent } from './delete-project/delete-project.component';
import { ProjectsService } from 'src/services/projects.service';
import { ProjectGetResponseDto } from 'src/dtos/projects/project-get-response.dto';
import FilterFuzzy from 'src/utils/filterFuzzy.util';
import Fuse from 'fuse.js';
import { AuthService } from 'src/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
   
  currentPage: number = 1;
  itensPerPage: number = 8;
  user:any;
  projects: ProjectGetResponseDto[] = []
  projectsFilter: ProjectGetResponseDto[] = []
  userId: any
  form: FormGroup  
  item_project: string = "0"; 

  constructor(
    public authService: AuthService, 
    private formBuilder: FormBuilder,
    private router: Router,
    private ngbModal: NgbModal,
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private readonly ngxSpinnerService: NgxSpinnerService,      
  ) {
    this.form = this.formBuilder.group({
      search: ['', [Validators.required, Validators.minLength(3)]]
    })           

  }

  ngOnInit(): void {

    const id = localStorage.getItem('id_projects');
    if(id && id == '0'){      
      localStorage.removeItem('id_projects')
      this.projectsFilter = this.projectsService.getProjectsFilterList();
      this.projects = this.projectsService.getProjectsList();
    }else{
      this.ngxSpinnerService.show();
      this.getProjects()  
    }
            
    this.form.controls['search'].valueChanges.subscribe((text: string) => {    
      if (text) {        
             
        const name = this.projects.filter(obj => ((obj.name).toLowerCase()).includes(text.toLowerCase()));
        const project_manager_name = this.projects.filter(obj => ((obj.project_manager.name).toLowerCase()).includes(text.toLowerCase()));
        
        const array = [...name, ...project_manager_name]
        const dataArr = new Set(array)
        const result = [...dataArr]; 
   
        this.projectsFilter = result
      }
      else{
        this.projectsFilter = this.projects
      }            
    });   
    
  }

  ngDoCheck(): void {
    if (this.item_project !== localStorage.getItem('item_project')) {      
        this.item_project = localStorage.getItem('item_project');
        this.projectsFilter = this.projectsFilter.filter( ar => ar._id != this.item_project)
        localStorage.removeItem('item_project')
    }
  } 

  checkUser(){
    const equal = this.user.type === this.authService.getAuthenticatedUser().type;
    if(!equal){
      window.location.reload();
    }
    return equal;
  }
  getProjects() {
    this.userId = JSON.parse(localStorage.getItem("user")); 
    if(this.authService.getAuthenticatedUser().type === 'associacao') {
      this.projectsService.findAllProjectsForAssociationId(this.userId.id).subscribe({
        next: data => {          
          this.projects = data;
          this.projectsFilter = data;
          this.projectsService.setProjectsFilterList(data);
          this.projectsService.setProjectsList(data);
          this.ngxSpinnerService.hide();
        },
        error: err => {
          console.log(err)
        }
      })
    } else if(this.authService.getAuthenticatedUser().roles === 'visualizador_projetos') {
      this.projectsService.findAllProjectsForViewerId(this.userId.id).subscribe({
        next: data => {
        
            this.projects = data
            this.projectsFilter = data
            this.projectsService.setProjectsFilterList(data);
            this.projectsService.setProjectsList(data);
            this.ngxSpinnerService.hide();
        },
        error: err => {
          console.error(err)
        }
        // gerente_geral_projetos
      })
    } else if(this.authService.getAuthenticatedUser().roles === 'revisor_projetos') {
      this.projectsService.findAllProjectsForReviewerId(this.userId.id).subscribe({
        next: data => {            
            this.projects = data
            this.projectsFilter = data
            this.projectsService.setProjectsFilterList(data);
            this.projectsService.setProjectsList(data);
            this.ngxSpinnerService.hide();
        },
        error: err => {
          console.error(err)
        }
        
      })
    }
    else if(this.authService.getAuthenticatedUser().roles === 'gerente_geral_projetos') {
      this.projectsService.findAllProjectsForManagerId(this.userId.id).subscribe({
        next: data => {
        
            this.projects = data
            this.projectsFilter = data
            this.projectsService.setProjectsFilterList(data);
            this.projectsService.setProjectsList(data);
            this.ngxSpinnerService.hide();
        },
        error: err => {
          console.error(err)
        }
      })
    }
    else {
      this.projectsService.getProjects().subscribe({
        next: data => {
          
            this.projects = data
            this.projectsFilter = data
            this.projectsService.setProjectsFilterList(data);
            this.projectsService.setProjectsList(data);
            this.ngxSpinnerService.hide();
          
        },
        error: err => {
          console.error(err)
        }
        
      })
    }

  }

  navigateToItem(item: ProjectGetResponseDto) {
    this.router.navigate(['/pages/dados-projeto/' + item._id]);
  }

  delete(project: any) {
    const modalRef = this.ngbModal.open(DeleteProjectComponent, {
      centered: true,
      backdrop: true,
      size: 'md',
    });
    modalRef.componentInstance.project = project;
    modalRef.result.then(
      () => { },
      error => {        
        //this.getProjects();
      }
    );
  }
}
