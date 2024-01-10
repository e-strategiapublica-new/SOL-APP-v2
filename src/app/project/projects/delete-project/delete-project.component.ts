import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ProjectsService } from 'src/services/projects.service';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.scss']
})
export class DeleteProjectComponent {

  @Input() project!: any;

  constructor(
    private activeModal: NgbActiveModal,
    private projectsService: ProjectsService,
    private toastrService: ToastrService,
    private translate: TranslateService
  ) {

  }

  confirm() { 
    
    this.projectsService.deleteProjectById(this.project._id).subscribe({
      next: data => {
        this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_DELETE_PROJECT'), '', { progressBar: true })
        localStorage.setItem('item_project', this.project._id)
        this.closeModal()
      },
      error: err => {
        console.error(err)
      }
    })    
    
  }

  closeModal() {
    this.activeModal.close();
  }

}
