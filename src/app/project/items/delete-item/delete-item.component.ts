import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ItemsService } from 'src/services/items.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-item',
  templateUrl: './delete-item.component.html',
  styleUrls: ['./delete-item.component.scss']
})
export class DeleteItemComponent implements OnInit {

  storedLanguage : string | null  

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    public localStorage: LocalStorageService,
    private toastrService: ToastrService,    
    private itemsService: ItemsService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private translate: TranslateService
  ) { 
  }

  ngOnInit(): void {    
    this.storedLanguage = localStorage.getItem('selectedLanguage');     
  }

  
  deleteItem() {
    this.ngxSpinnerService.show();
    this.itemsService.delete(this.localStorage.getDataItem()._id).subscribe({
      next: (data) => {

        let successMessage = 'Item deletada com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Item deletada com sucesso!'
            break;
          case 'en':
            successMessage = 'Article deleted successfully!'
            break;
          case 'fr':
            successMessage = 'Article supprimée avec succès!'
            break;
          case 'es':
            successMessage = 'Artículo eliminada con éxito!'
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
