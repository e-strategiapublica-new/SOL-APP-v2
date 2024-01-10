import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ClassesService } from 'src/services/classes.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { ProductService } from 'src/services/product.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-class',
  templateUrl: './delete-class.component.html',
  styleUrls: ['./delete-class.component.scss']
})
export class DeleteClassComponent implements OnInit {

  storedLanguage : string | null

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    public localStorage: LocalStorageService,
    private toastrService: ToastrService,    
    private classesService: ClassesService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private translate: TranslateService
  ) { 
  }

  ngOnInit(): void {
    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }

  deleteClass() {    

    this.ngxSpinnerService.show();
    const _id = localStorage.getItem('class_id');

    this.classesService.delete(_id).subscribe({
      next: (data) => {

        let successMessage = 'Class deletada com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Class deletada com sucesso!'
            break;
          case 'en':
            successMessage = 'Class deleted successfully!'
            break;
          case 'fr':
            successMessage = 'classe supprimée avec succès!'
            break;
          case 'es':
            successMessage = 'Clase eliminada con éxito!'
            break;
        }

        this.ngxSpinnerService.hide();
        this.toastrService.success(successMessage, '', { progressBar: true });
        this.modalService.dismissAll();
       
      },
      error: (error) => {

        this.ngxSpinnerService.hide();

        if(!error){
          this.toastrService.error(this.translate.instant('TOASTRS.INTERNAL_SERVER_ERROR'), '', { progressBar: true });
          return;    
        }

        switch(error.error.code){
          case 1:
            this.toastrService.error(this.translate.instant('TOASTRS.ERROR_INVALID_CLASS_ID'), '', { progressBar: true });
            return;    
        }
        
      }
    });
    
  }

  closeModal() {
    this.activeModal.close();
  }

}
