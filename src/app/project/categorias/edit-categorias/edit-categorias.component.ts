import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryRequestDto } from 'src/dtos/category/category-request.dto';
import { CategoryService } from 'src/services/category.service';
import { LocalStorageService } from 'src/services/local-storage.service';

@Component({
  selector: 'app-edit-categorias',
  templateUrl: './edit-categorias.component.html',
  styleUrls: ['./edit-categorias.component.scss']
})
export class EditCategoriasComponent implements OnInit {

  form: FormGroup;
  isSubmit: boolean = false;
  request: CategoryRequestDto;
  storedLanguage : string | null

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    public localStorage: LocalStorageService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      category: ['', [Validators.required, Validators.maxLength(50)]],
      segment: ['', [Validators.required]],
      code: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {
    this.form.patchValue({
      category: this.localStorage.getDataCategoria().category_name,
      segment: this.localStorage.getDataCategoria().segment,
      code: this.localStorage.getDataCategoria().code,
    });
    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.status == 'INVALID') {
      return;
    }
    this.request = {
      category_name: this.form.controls['category'].value,
      segment: this.form.controls['segment'].value,
      code: this.form.controls['code'].value,
      identifier: this.localStorage.getDataCategoria().identifier,
    }
    this.categoryService.update(this.localStorage.getDataCategoria()._id, this.request).subscribe({
      next: (success) => {
        
        let successMessage = 'Categoria editada com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Categoria editada com sucesso!'
            break;
          case 'en':
            successMessage = 'Category successfully edited!'
            break;
          case 'fr':
            successMessage = 'Catégorie modifiée avec succès'
            break;
          case 'es':
            successMessage = '¡Categoría editada con éxito!'
            break;
        }

        this.toastrService.success(successMessage, '', { progressBar: true });
        this.router.navigate(['/pages/categorias']);
      },
      error: (error) => {

        let errorMessage = 'Erro ao editar a categoria!';

        switch(this.storedLanguage) {
          case 'pt': 
            errorMessage = 'Erro ao editar a categoria!'
            break;
          case 'en':
            errorMessage = 'Error editing category!'
            break;
          case 'fr':
            errorMessage = 'Erreur lors de la modification de la catégorie!'
            break;
          case 'es':
            errorMessage = '¡Error al editar la categoría!'
            break;
        }

        console.error(error);
        this.toastrService.error(errorMessage, '', { progressBar: true });
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });
  }

  cancel(){      
    localStorage.setItem('id_category','0');
    this.router.navigate(['/pages/categorias']);  
  }

}

