import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CategoryRequestDto } from 'src/dtos/category/category-request.dto';
import { ProductRequestDto } from 'src/dtos/product/product-request.dto';
import { CategoryService } from 'src/services/category.service';
import { ProductService } from 'src/services/product.service';
import { TranslateService } from '@ngx-translate/core';
 
@Component({
  selector: 'app-new-categorias',
  templateUrl: './new-categorias.component.html',
  styleUrls: ['./new-categorias.component.scss']
})
export class NewCategoriasComponent implements OnInit {

  form: FormGroup;
  isSubmit: boolean = false;
  request: CategoryRequestDto;
  storedLanguage : string | null
  validCode: boolean = true;

  regex2dig =  /^\d{2}$/ // Permite un número de 2 dígitos
  regex1dig =  /^\d{1}$/  

  constructor(
    private formBuilder: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private categoryService: CategoryService,
    private router: Router,
    private translate: TranslateService,
  ) {
    this.form = this.formBuilder.group({
      category: ['', [Validators.required, Validators.maxLength(50)]],
      segment: ['', [Validators.required]],
      code: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {
    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }

  onSubmit() {

    if(!this.regex2dig.test(this.form.controls['code'].value)){
      this.validCode = false;
      return;
    }

    this.isSubmit = true;   

    if (this.form.status == 'INVALID') {
      return;
    }
    this.request = {
      category_name: this.form.controls['category'].value,
      segment: this.form.controls['segment'].value,
      code: parseInt(this.form.controls['code'].value),
      identifier: 0,
    }
    this.categoryService.register(this.request).subscribe({
      next: (success) => {
          
        let successMessage = 'Categoria cadastrada com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Categoria cadastrada com sucesso!'
            break;
          case 'en':
            successMessage = 'Category registered successfully!'
            break;
          case 'fr':
            successMessage = 'Catégorie enregistrée avec succès !'
            break;
          case 'es':
            successMessage = '¡Categoría registrada con éxito!'
            break;
        }

        this.toastrService.success(successMessage, '', { progressBar: true });
        this.router.navigate(['/pages/categorias']);
      },
      error: (error) => {
        
        if(!error){
          this.toastrService.error(this.translate.instant('TOASTRS.INTERNAL_SERVER_ERROR'), '', { progressBar: true });
          return;    
        }

        switch(error.error.code){
          case 1:
            this.toastrService.error(this.translate.instant('TOASTRS.ERROR_INVALID_CODE'), '', { progressBar: true });
            return;    
        }
               
      }
    });
  }

  cancel(){      
    localStorage.setItem('id_category','0');
    this.router.navigate(['/pages/categorias']);  
  }

  validateCode() { 

    const code = this.form.controls['code'].value;    

    if(code.length == 1){
      if(this.regex1dig.test(code.charAt(0))){
        this.validCode = true;            
      }else{
        this.validCode = false;
      }
      return
    }else{
      if(code.length > 1){
        if(this.regex2dig.test(code)){      
          this.validCode = true;  
        }else{      
          this.validCode = false;  
        }
        return;
      }
      if(code.length == 0){
        this.validCode = true;
      }
    }
 
  }

}

