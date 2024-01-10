import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ClassesRequestDto } from 'src/dtos/classes/classes-request.dto';
import { ClassesService } from 'src/services/classes.service';
import { CategoryService } from 'src/services/category.service';
import { PdmService } from 'src/services/pdm.service';
import { ProductService } from 'src/services/product.service';
import { TranslateService } from '@ngx-translate/core';
 
@Component({
  selector: 'app-new-pdm',
  templateUrl: './new-pdm.component.html',
  styleUrls: ['./new-pdm.component.scss']
})
export class NewPdmComponent implements OnInit {

  form: FormGroup;
  isSubmit: boolean = false;
  request: any;
  storedLanguage : string | null
  validCode: boolean = true;

  regex5dig =  /^\d{5}$/ // Permite un número de 5 dígitos  

  groupList: any[]  
  selectedGroup: string = "1";

  classList: any[] = [];
  selectedClass: string = "1";

  tempClassList: any[] = [];
  classListSaved: any[] = [];

  unitList: any[] = []
  propertyList: any[] = []

  constructor(
    private formBuilder: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private classesService: ClassesService,
    private categoryService: CategoryService,
    private pdmService: PdmService,
    private router: Router,
    private translate: TranslateService,
  ) {
    this.form = this.formBuilder.group({
      group: ['', [Validators.required]],
      class: ['', [Validators.required]],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      property: ['', [Validators.required]],
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

    // get classes
    this.classesService.getClasses().subscribe({
      next: data => {                
        this.classListSaved = data;
      },
      error: error => {        
        
      }
    });

    // Classes are shown by group
    this.form.controls['group'].valueChanges.subscribe((text: string) => {
      this.selectedClass = "1";
      if(this.classList.length){  
        this.classList.splice(0, this.classList.length);        
      }
      for(let i = 0; i < this.classListSaved.length; i++){      
          if(this.classListSaved[i].group._id == text ){
              this.classList.push(this.classListSaved[i])
          }
      }                
    })

  }

  onSubmit() { 

    if(!this.regex5dig.test(this.form.controls['code'].value)){
      this.validCode = false;      
      return;
    }

    this.isSubmit = true;       

    const _group = this.obtainGroup(this.form.controls['group'].value)
    const _class = this.obtainClass(this.form.controls['class'].value)    

    this.request = {
      group: _group,
      class: _class,
      code: parseInt(this.form.controls['code'].value),    
      name: this.form.controls['name'].value,
      unitList: this.unitList,
      propertyList: this.propertyList
    }        
    
    this.pdmService.register(this.request).subscribe({
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
        this.router.navigate(['/pages/pdm']);
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
    localStorage.setItem('id_pdm','0');
    this.router.navigate(['/pages/pdm']);  
  }

  validateCode() { 

    const code = this.form.controls['code'].value;    

    if(code.length < 5){
      if(!isNaN(code)){
        this.validCode = true;            
      }else{
        this.validCode = false;
      }
      return
    }else{
      if(code.length == 5){
        if(this.regex5dig.test(code)){      
          this.validCode = true;  
        }else{      
          this.validCode = false;  
        }
        return;
      }
      if(code.length == 0){
        this.validCode = true;
      }
      if(code.length > 5){
        this.validCode = false;
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

  obtainClass(_id: string){
    for (let i = 0; i < this.classList.length; i++) {
      if(this.classList[i]._id == _id){
          return { _id: this.classList[i]._id, code: this.classList[i].code, description: this.classList[i].description }
      }            
    }
    return { type: "error" }
  }

  addUnit(){    
    if(this.form.controls['unit'].value){
      this.unitList.push(this.form.controls['unit'].value);
      this.form.controls['unit'].setValue("")
    }
  }

  deleteUnit(index: number){
    this.unitList.splice(index, 1);
  }

  addProperty(){    
    if(this.form.controls['property'].value){
      this.propertyList.push({"property": this.form.controls['property'].value, "required": false});
      this.form.controls['property'].setValue("")
    }
  }

  deleteProperty(index: number){
    this.propertyList.splice(index, 1);
  }

  pressCheck(index: number){
    if(this.propertyList[index].required){
      this.propertyList[index].required = false
    }else{
      this.propertyList[index].required = true
    }
  }

}

