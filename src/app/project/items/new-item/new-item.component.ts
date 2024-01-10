import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ClassesRequestDto } from 'src/dtos/classes/classes-request.dto';
import { ClassesService } from 'src/services/classes.service';
import { CategoryService } from 'src/services/category.service';
import { ItemsService } from 'src/services/items.service';
import { PdmService } from 'src/services/pdm.service';
import { ProductService } from 'src/services/product.service';
import { TranslateService } from '@ngx-translate/core';
  
@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss']
})
export class NewItemComponent implements OnInit {

  form: FormGroup;
  isSubmit: boolean = false;
  request: any;
  storedLanguage : string | null
  validCode: boolean = true;

  regex9dig =  /^\d{9}$/ // Permite un número de 9 dígitos  

  groupList: any[]  
  selectedGroup: string = "1";

  classList: any[] = []  
  selectedClass: string = "1";

  pdmList: any[] = []
  selectedPdm: string = "1"

  
  classListSaved: any[] = [];
  pdmListSaved: any[] = [];

  propertyList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private classesService: ClassesService,
    private categoryService: CategoryService,
    private itemsService: ItemsService,
    private pdmService: PdmService,
    private router: Router,
    private translate: TranslateService,
  ) {
    this.form = this.formBuilder.group({
      group: ['', [Validators.required]],
      class: ['', [Validators.required]],
      pdm: ['', [Validators.required]],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]]      
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

    // get pdm
    this.pdmService.getPdm().subscribe({
      next: data => {        
        this.pdmListSaved = data;        
      },
      error: error => {        
        
      }
    });

    // Get classes by group
    this.form.controls['group'].valueChanges.subscribe((id: string) => {      
      this.selectedClass = "1";
      if(this.classList.length){  
        this.classList = []        
      }
      for(let i = 0; i < this.classListSaved.length; i++){      
          if(this.classListSaved[i].group._id == id ){
            this.classList.push(this.classListSaved[i])
          }
      }                
    })

    // Get PDM by Class
    this.form.controls['class'].valueChanges.subscribe((id: string) => {      
      
      this.selectedPdm = "1";
      this.pdmList = []    

      for(let i = 0; i < this.pdmListSaved.length; i++){      
          if(this.pdmListSaved[i].class._id == id ){
              this.pdmList.push(this.pdmListSaved[i])
          }
      }    
     
    })

    // PDM chosen to display property list 
    this.form.controls['pdm'].valueChanges.subscribe((id: string) => {      

      this.propertyList = [];

      for(let i = 0; i < this.pdmList.length; i++){               
          if(this.pdmList[i]._id == id ){             
            this.propertyList = this.pdmList[i].propertyList;
            break;
          }                                   
      }
      
    })

  }

  onSubmit() {

    if(!this.regex9dig.test(this.form.controls['code'].value)){
      this.validCode = false;
      return;
    }

    this.isSubmit = true;   

    if (this.form.status == 'INVALID') {
      return;
    }

    const _group = this.obtainGroup(this.form.controls['group'].value);
    const _class = this.obtainClass(this.form.controls['class'].value);
    const _pdm = this.obtainPdm(this.form.controls['pdm'].value);    
    const _propertyList = this.createPropertyList();
    
    for(let i=0;i<_propertyList.length;i++){
      if(_propertyList[i].error){
        this.propertyList[i].error = _propertyList[i].error
        return;
      }
    }    

    this.request = {
      group: _group,
      class: _class,
      pdm: _pdm,
      code: parseInt(this.form.controls['code'].value),    
      name: this.form.controls['name'].value,
      propertyListValue: _propertyList    
    }        
    
    this.itemsService.register(this.request).subscribe({
      next: (success) => {

        let successMessage = 'Item cadastrado com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Item cadastrado com sucesso!'
            break;
          case 'en':
            successMessage = 'Item successfully registered!'
            break;
          case 'fr':
            successMessage = 'Article inscrit avec succès!'
            break;
          case 'es':
            successMessage = 'Artículo registrada con éxito!'
            break;
        }

        this.toastrService.success(successMessage, '', { progressBar: true });
        this.router.navigate(['/pages/items']);
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
    localStorage.setItem('id_items','0');
    this.router.navigate(['/pages/items']);  
  }

  validateCode() { 

    const code = this.form.controls['code'].value;    

    if(code.length < 9){
      if(!isNaN(code)){
        this.validCode = true;            
      }else{
        this.validCode = false;
      }
      return
    }else{
      if(code.length == 9){
        if(this.regex9dig.test(code)){      
          this.validCode = true;  
        }else{      
          this.validCode = false;  
        }
        return;
      }
      if(code.length == 0){
        this.validCode = true;
      }
      if(code.length > 9){
        this.validCode = false;
      }
    }
 
  }

  obtainGroup(_id: string){    
    for (let i = 0; i < this.groupList.length; i++) {
      if(this.groupList[i]._id == _id){
          return { _id: this.groupList[i]._id, category_name: this.groupList[i].category_name, code: this.groupList[i].code, segment: this.groupList[i].segment }
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

  obtainPdm(_id: string){
    for (let i = 0; i < this.pdmList.length; i++) {
      if(this.pdmList[i]._id == _id){
          return { _id: this.pdmList[i]._id, code: this.pdmList[i].code, name: this.pdmList[i].name, unitList: this.pdmList[i].unitList }
      }            
    }
    return { type: "error" }
  }

  onInput(value: string, position: number) {    
    this.propertyList[position].value = value;
    if(this.propertyList[position].value){
      delete this.propertyList[position].error
    }
  }

  createPropertyList(){
    const _propertyList = JSON.parse(JSON.stringify(this.propertyList));

    for (let i = 0; i < _propertyList.length; i++){ 
        delete this.propertyList[i].error       
        if(!_propertyList[i].value){
          _propertyList[i].value = ""
          if(_propertyList[i].required == true){
            _propertyList[i].error = "is required"            
          }
        }
        delete _propertyList[i].required;
    }
    return _propertyList;
  }

}

