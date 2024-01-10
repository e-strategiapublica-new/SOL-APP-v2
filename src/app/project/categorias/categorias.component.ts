import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeleteProdutoComponent } from '../produtos/delete-produto/delete-produto.component';
import { CategoryResponseDto } from 'src/dtos/category/category-response.dto';
import { CategoryService } from 'src/services/category.service';
import { DeleteCategoriasComponent } from './delete-categorias/delete-categorias.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import FilterFuzzy from 'src/utils/filterFuzzy.util';
import Fuse from 'fuse.js';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent  implements OnInit{

  currentPage: number = 1;
  itensPerPage: number = 8;
  filterTerm: string;
  form: FormGroup
  user:any
  categoryList: CategoryResponseDto[];
  categoryFilterList: CategoryResponseDto[];  

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private ngxSpinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    public router: Router

  ) { 
    this.form = this.formBuilder.group({
      search: ['', [Validators.required, Validators.minLength(3)]],      
    });    

  }

  ngOnInit(): void {
      
    const id = localStorage.getItem('id_category');
    if(id && id == '0'){      
      localStorage.removeItem('id_category')
      this.categoryFilterList = this.categoryService.getCategoryFilterList();
      this.categoryList = this.categoryService.getCategoryList();
    }else{
      this.ngxSpinnerService.show();
      this.getCategory()  
    }

    
    this.form.controls['search'].valueChanges.subscribe((text: string) => {
          
      if (text){

        const category_name = this.categoryList.filter(obj => ((obj.category_name).toLowerCase()).includes(text.toLowerCase()));        
        const code = this.categoryList.filter(obj => (obj.code).toString().includes(text));
        const segment = this.categoryList.filter(obj => ((obj.segment).toLowerCase()).includes(text.toLowerCase()));
              
        const array = [...category_name, ...code, ...segment]        
        const dataArr = new Set(array)
        const result = [...dataArr];
         
        this.categoryFilterList = result
      }
      else
        this.categoryFilterList = this.categoryList
    });    

  }

  checkUser(){
    const equal = this.user.type === this.authService.getAuthenticatedUser().type;
    if(!equal){
      window.location.reload();
    }
    return equal;
  }
  getCategory() {
    this.categoryService.getCategory().subscribe({
      next: success => {
        this.categoryList = success;
        this.categoryFilterList = success
        this.categoryService.setCategoryFilterList(success);
        this.categoryService.setCategoryList(success);
        this.ngxSpinnerService.hide();
      },
      error: error => {
        this.ngxSpinnerService.hide();
        this.categoryFilterList = []
      }
    });
  }

  editCategory(i: any) {
      localStorage.setItem('editcategoria', JSON.stringify(i));
      this.router.navigate(['pages/categorias/editar-categoria']);
  }

  delete(i: any, Id: string) {
    localStorage.setItem('editcategoria', JSON.stringify(i));
    const modal = this.modalService.open(DeleteCategoriasComponent, { centered: true, backdrop: true, size: 'md',keyboard: false })
    modal.result.then((result) => {
    }, err => {
      this.getCategory();
    })
  }  

}

