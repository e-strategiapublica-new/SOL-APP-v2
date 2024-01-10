import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/services/category.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { ProductService } from 'src/services/product.service';

@Component({
  selector: 'app-delete-categorias',
  templateUrl: './delete-categorias.component.html',
  styleUrls: ['./delete-categorias.component.scss']
})
export class DeleteCategoriasComponent implements OnInit {

  storedLanguage : string | null  

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    public localStorage: LocalStorageService,
    private toastrService: ToastrService,    
    private categoryService: CategoryService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { 
  }

  ngOnInit(): void {
    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }

  deleteCategory() {
    this.ngxSpinnerService.show();
    this.categoryService.delete(this.localStorage.getDataCategoria()._id).subscribe({
      next: (data) => {

        let successMessage = 'Categoria deletada com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Categoria deletada com sucesso!'
            break;
          case 'en':
            successMessage = 'Category deleted successfully!'
            break;
          case 'fr':
            successMessage = 'Catégorie supprimée avec succès!'
            break;
          case 'es':
            successMessage = 'Categoría eliminada con éxito!'
            break;
        }

        this.ngxSpinnerService.hide();
        this.toastrService.success(successMessage, '', { progressBar: true });
        this.modalService.dismissAll();
       
      },
      error: (error) => {

        let errorMessage = 'Erro ao deletar categoria!';

        switch(this.storedLanguage) {
          case 'pt': 
            errorMessage = 'Erro ao deletar categoria!'
            break;
          case 'en':
            errorMessage = 'Error deleting category!'
            break;
          case 'fr':
            errorMessage = 'Erreur lors de la suppression de la catégorie!'
            break;
          case 'es':
            errorMessage = 'Error al eliminar la categoría!'
            break;
        }

        this.ngxSpinnerService.hide();        
        this.toastrService.error(errorMessage, '', { progressBar: true });
      }
    });
  }

  closeModal() {
    this.activeModal.close();
  }

}
