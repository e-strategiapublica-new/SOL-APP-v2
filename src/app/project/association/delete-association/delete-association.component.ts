import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { AssociationService } from 'src/services/association.service';

@Component({
  selector: 'app-delete-association',
  templateUrl: './delete-association.component.html',
  styleUrls: ['./delete-association.component.scss']
})
export class DeleteAssociationComponent implements OnInit {

  association!: AssociationResponseDto;
  storedLanguage : string | null

  constructor(
    private associationService: AssociationService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private ngbModal: NgbModal,
  ) { }

  ngOnInit(): void {
    
    this.association = this.associationService.deleteAssociation!;
    let cancel = document.getElementById('cancel');
    cancel?.focus();

    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }

  deleteAssociation() {
   this.ngxSpinnerService.show();
    this.associationService.delete(this.association._id).subscribe({
      next: (data) => {

        let successMessage = 'Associação deletada com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Associação deletada com sucesso!'
            break;
          case 'en':
            successMessage = 'Association deleted successfully!'
            break;
          case 'fr':
            successMessage = 'Association supprimée avec succès !'
            break;
          case 'es':
            successMessage = '¡Asociación eliminada con éxito!'
            break;
        }

        this.ngxSpinnerService.hide();
        this.toastrService.success('Associação deletada com sucesso!', '', { progressBar: true });
        this.associationService.deleted = true;
        this.ngbModal.dismissAll();
      },
      error: (error) => {

        let errorMessage = 'Erro ao deletar associação!';

        switch(this.storedLanguage) {
          case 'pt': 
            errorMessage = 'Erro ao deletar associação!'
            break;
          case 'en':
            errorMessage = 'Error deleting association!'
            break;
          case 'fr':
            errorMessage = "Erreur lors de la suppression de l'association !"
            break;
          case 'es':
            errorMessage = '¡Error al eliminar la asociación!'
            break;
        }

        this.ngxSpinnerService.hide();
        console.error(error);
        this.toastrService.error(errorMessage, '', { progressBar: true });
      }
    });
  }

  closeModal() {
    this.ngbModal.dismissAll();
  }

}
