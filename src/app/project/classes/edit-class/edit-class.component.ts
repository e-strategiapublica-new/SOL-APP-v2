import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/services/category.service';
import { ClassesService } from 'src/services/classes.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-class',
  templateUrl: './edit-class.component.html',
  styleUrls: ['./edit-class.component.scss']
})
export class EditClassComponent implements OnInit {

  form: FormGroup;
  isSubmit: boolean = false;
  request: any;
  storedLanguage : string | null

  selectedGroup: string;  
  _id: string

  groupList: any[];

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    public localStorage: LocalStorageService,
    private categoryService: CategoryService,
    private classesService: ClassesService,
    private router: Router,
    private translate: TranslateService,
  ) {
    this.form = this.formBuilder.group({
      group: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required]]      
    });
  }


  ngOnInit(): void {  
    this.storedLanguage = localStorage.getItem('selectedLanguage');

    // get groups
    this.categoryService.getCategory().subscribe({
      next: data => {        
        this.groupList = data;
      },
      error: error => {        
        
      }
    });

    const editclass = localStorage.getItem('editclass');
    const objClass = JSON.parse(editclass);
    this.selectedGroup = objClass.group._id;
    this.form.controls['description'].setValue(objClass.description);
    this._id = objClass._id;    

  }

  onSubmit() {
    
    this.isSubmit = true;
    
    if (this.form.status == 'INVALID') {
      return;
    }
    
    const group = this.obtainGroup(this.form.controls['group'].value)

    this.request = {
      group: group,         
      description: this.form.controls['description'].value,      
    }     
    
    this.classesService.update(this._id, this.request).subscribe({
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
        this.router.navigate(['/pages/classes']);
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
    localStorage.setItem('id_classes','0');
    this.router.navigate(['/pages/classes']);  
  }

  obtainGroup(_id: string){
    for (let i = 0; i < this.groupList.length; i++) {
      if(this.groupList[i]._id == _id){
          return { _id: this.groupList[i]._id, code: this.groupList[i].code, segment: this.groupList[i].segment }
      }            
    }
    return { type: "error" }
  }

}

