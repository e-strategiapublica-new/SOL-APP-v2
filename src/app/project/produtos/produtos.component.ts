import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from 'src/services/product.service';
import { ProductResponseDto } from 'src/dtos/product/product.response.dto';
import { DeleteProdutoComponent } from './delete-produto/delete-produto.component';
import Fuse from 'fuse.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent  implements OnInit{

  currentPage: number = 1;
  itensPerPage: number = 8;
  filterTerm: string;

  productList: ProductResponseDto[];
  productFilterList: ProductResponseDto[]
  form: FormGroup;
  user:any


  constructor(
    public authService: AuthService, 
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private ngxSpinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    public router: Router

  ) { 
    this.form = this.formBuilder.group({
      search: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {

    const id = localStorage.getItem('id_product');
    if(id && id == '0'){      
      localStorage.removeItem('id_product')
      this.productFilterList = this.productService.getProductFilterList();
      this.productList = this.productService.getProductList();
    }else{
      this.ngxSpinnerService.show();
      this.getProdutcs()  
    }

    this.form.controls['search'].valueChanges.subscribe((text: string) => {
      if (text){
 
        const options: any = {
          keys: ['pdm','product_name']
         }
         
        const pdm = this.productList.filter(obj => ((obj.pdm).toLowerCase()).includes(text.toLowerCase()));
        const product_name = this.productList.filter(obj => ((obj.product_name).toLowerCase()).includes(text.toLowerCase()));
        
        const array = [...pdm, ...product_name]        
        const dataArr = new Set(array)
        const result = [...dataArr];
         
        this.productFilterList = result
      }
      else
      this.productFilterList= this.productList
    });

  }

  checkUser(){
    const equal = this.user.type === this.authService.getAuthenticatedUser().type;
    if(!equal){
      window.location.reload();
    }
    return equal;
  }
  getProdutcs() {
    this.productService.getProduct().subscribe({
      next: (success) => {
        this.productList = success;
        this.productFilterList = success
        this.productService.setProductFilterList(success);
        this.productService.setProductList(success);
        this.ngxSpinnerService.hide();
      },
      error: (error) => {
        this.ngxSpinnerService.hide();
      }
    });
  }

  editItem(i: any) {
      localStorage.setItem('editprodutos', JSON.stringify(i));
      this.router.navigate(['pages/produtos/editar-produto']);
  }

  delete(i: any, Id: string) {
    localStorage.setItem('editprodutos', JSON.stringify(i));
    const modal = this.modalService.open(DeleteProdutoComponent, { centered: true, backdrop: true, size: 'md',keyboard: false })
    modal.result.then((result) => {
    }, err => {
      this.getProdutcs();
    })
  }

}
