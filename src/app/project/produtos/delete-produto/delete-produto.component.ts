import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/services/local-storage.service';
import { ProductService } from 'src/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-produto',
  templateUrl: './delete-produto.component.html',
  styleUrls: ['./delete-produto.component.scss']
})
export class DeleteProdutoComponent implements OnInit {


  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private productService: ProductService,
    public localStorage: LocalStorageService,
    private toastrService: ToastrService,    
    public activeModal: NgbActiveModal,
    public router: Router
  ) { 
  }

  ngOnInit(): void {
  }

  deleteItem() {
    this.ngxSpinnerService.show();
    this.productService.delete(this.localStorage.getDataProdutos()._id).subscribe({
      next: (data) => {
        this.ngxSpinnerService.hide();
        this.toastrService.success('Produto deletado com sucesso!', '', { progressBar: true });
        this.activeModal.dismiss();
      },
      error: (error) => {
        this.ngxSpinnerService.hide();        
        this.toastrService.error('Erro ao deletar Produto!', '', { progressBar: true });
      }
    });
  }

  closeModal() {
    this.activeModal.close();   
  }

}