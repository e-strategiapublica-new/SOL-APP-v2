import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/services/local-storage.service';
import { ModelContractService } from 'src/services/model-contract.service';

@Component({
  selector: 'app-delete-contract-templates',
  templateUrl: './delete-contract-templates.component.html',
  styleUrls: ['./delete-contract-templates.component.scss']
})
export class DeleteContractTemplatesComponent implements OnInit{

  form: FormGroup;
  name: string;
  constructor(
    private ngbModal: NgbModal,
    private _modelContractService:ModelContractService,
    public localStorage: LocalStorageService,
    private toastrService: ToastrService,
  ) {}

  

  ngOnInit(): void {
    this.name =  this.localStorage.getDataModelContractId().name
  }
  
  //onDelete() {
  //  this._modelContractService.delete(this.localStorage.getDataModelContractId()._id).subscribe({
  //    next: (data) => {

        // let successMessage = 'Item deletado com sucesso!';

        // switch(this.storedLanguage) {
        //   case 'pt': 
        //     successMessage = 'Item deletado com sucesso!'
        //     break;
        //   case 'en':
        //     successMessage = 'Item deleted successfully!'
        //     break;
        //   case 'fr':
        //     successMessage = 'Article supprimé avec succès !'
        //     break;
        //   case 'es':
        //     successMessage = '¡Artículo eliminado con éxito!'
        //     break;
        // }

  //      this.toastrService.success(successMessage, '', { progressBar: true });
  //      this.ngbModal.dismissAll();
  //    },
  //    error: (error) => {
    
          // let errorMessage = 'Erro ao deletar item!';

          // switch(this.storedLanguage) {
          //   case 'pt': 
          //     errorMessage = 'Erro ao deletar item!'
          //     break;
          //   case 'en':
          //     errorMessage = 'Error deleting item!'
          //     break;
          //   case 'fr':
          //     errorMessage = 'Erreur lors de la suppression de l'élément !'
          //     break;
          //   case 'es':
          //     errorMessage = '¡Error al eliminar el artículo!'
          //     break;
          // }

  //      console.error(error);
  //      this.toastrService.error(errorMessage, '', { progressBar: true });
  //    }
  //  });
  //}
  
  closeModal() {
    this.ngbModal.dismissAll();
  }

}
