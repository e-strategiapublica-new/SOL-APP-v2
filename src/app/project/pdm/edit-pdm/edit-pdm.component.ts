import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/services/category.service';
import { PdmService } from 'src/services/pdm.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-pdm',
  templateUrl: './edit-pdm.component.html',
  styleUrls: ['./edit-pdm.component.scss']
})
export class EditPdmComponent implements OnInit {

  form: FormGroup;
  isSubmit: boolean = false;
  request: any;
  storedLanguage : string | null
  
  pdm: any;

  unitList: any[] = []
  propertyList: any[] = []

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    public localStorage: LocalStorageService,
    private categoryService: CategoryService,
    private pdmService: PdmService,
    private router: Router,
    private translate: TranslateService,
  ) {
    this.form = this.formBuilder.group({     
      name: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      property: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {  
    this.storedLanguage = localStorage.getItem('selectedLanguage');    
    this.pdm = this.localStorage.getDataPdm();   
    this.form.controls['name'].setValue(this.pdm.name)


    // Set the units
    for(let i = 0; i < this.pdm.unitList.length; i++){
        this.unitList.push(this.pdm.unitList[i]);
    }

    // Set the properties
    for(let i = 0; i < this.pdm.propertyList.length; i++){
        this.propertyList.push(this.pdm.propertyList[i]);
    }

  }

  onSubmit() {
    
    this.isSubmit = true;
               
    this.request = {
      name: this.form.controls['name'].value,
      unitList: this.unitList,
      propertyList: this.propertyList
    }    
    
    this.pdmService.update(this.localStorage.getDataPdm()._id, this.request).subscribe({
      next: (success) => {
        
        let successMessage = 'PDM editada com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'PDM editada com sucesso!'
            break;
          case 'en':
            successMessage = 'PDM successfully edited!'
            break;
          case 'fr':
            successMessage = 'PDM modifiée avec succès'
            break;
          case 'es':
            successMessage = 'PDM editada con éxito!'
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

