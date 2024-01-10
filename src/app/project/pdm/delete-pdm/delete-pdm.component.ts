import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PdmService } from 'src/services/pdm.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-pdm',
  templateUrl: './delete-pdm.component.html',
  styleUrls: ['./delete-pdm.component.scss']
})
export class DeletePdmComponent implements OnInit {

  storedLanguage : string | null  

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    public localStorage: LocalStorageService,
    private toastrService: ToastrService,    
    private pdmService: PdmService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private translate: TranslateService
  ) { 
  }

  ngOnInit(): void {    
    this.storedLanguage = localStorage.getItem('selectedLanguage');     
  }

  
  deletePdm() {
    this.ngxSpinnerService.show();
    this.pdmService.delete(this.localStorage.getDataPdm()._id).subscribe({
      next: (data) => {

        let successMessage = 'PDM deletada com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'PDM deletada com sucesso!'
            break;
          case 'en':
            successMessage = 'PDM deleted successfully!'
            break;
          case 'fr':
            successMessage = 'PDM supprimée avec succès!'
            break;
          case 'es':
            successMessage = 'PDM eliminada con éxito!'
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
