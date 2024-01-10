import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ClassesRequestDto } from 'src/dtos/classes/classes-request.dto';
import { ProductRequestDto } from 'src/dtos/product/product-request.dto';
import { ClassesService } from 'src/services/classes.service';
import { CategoryService } from 'src/services/category.service';
import { ProductService } from 'src/services/product.service';
import { TranslateService } from '@ngx-translate/core';
 
@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.scss']
})
export class NewClassComponent implements OnInit {

  form: FormGroup;
  isSubmit: boolean = false;
  request: ClassesRequestDto;
  storedLanguage : string | null
  validCode: boolean = true;

  regex2dig =  /^\d{2}$/ // Permite un número de 2 dígitos
  regex1dig =  /^\d{1}$/

  groupList: any[]
  selectedGroup: string = "1";

  constructor(
    private formBuilder: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private classesService: ClassesService,
    private categoryService: CategoryService,
    private router: Router,
    private translate: TranslateService,
  ) {
    this.form = this.formBuilder.group({
      group: ['', [Validators.required, Validators.maxLength(50)]],
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],      
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

    const group = this.obtainGroup(this.form.controls['group'].value)

    this.request = {
      group: group,   
      code: parseInt(this.form.controls['code'].value),    
      description: this.form.controls['description'].value,      
    }        
    
    this.classesService.register(this.request).subscribe({
      next: (success) => {

        let successMessage = 'Categoria cadastrada com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Turma cadastrada com sucesso!'
            break;
          case 'en':
            successMessage = 'Class successfully registered!'
            break;
          case 'fr':
            successMessage = 'Cours inscrit avec succès!'
            break;
          case 'es':
            successMessage = '¡Clase registrada con éxito!'
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
    localStorage.setItem('id_class','0');
    this.router.navigate(['/pages/classes']);  
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

  obtainGroup(_id: string){
    for (let i = 0; i < this.groupList.length; i++) {
      if(this.groupList[i]._id == _id){
          return { _id: this.groupList[i]._id, code: this.groupList[i].code, segment: this.groupList[i].segment }
      }            
    }
    return { type: "error" }
  }

}

