import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/services/category.service';
import { ItemsService } from 'src/services/items.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {

  form: FormGroup;
  isSubmit: boolean = false;
  request: any;
  storedLanguage : string | null
    
  propertyListValue: any[] = []

  item: any;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    public localStorage: LocalStorageService,
    private categoryService: CategoryService,
    private itemsService: ItemsService,
    private router: Router,
    private translate: TranslateService,
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]]
    });
  }


  ngOnInit(): void {  
    this.storedLanguage = localStorage.getItem('selectedLanguage');
    this.item = this.localStorage.getDataItem();   
    this.form.controls['name'].setValue(this.item.name)
    
    // Set the properties
    for(let i = 0; i < this.item.propertyListValue.length; i++){
      this.propertyListValue.push(this.item.propertyListValue[i]);
    }

  }

  onSubmit() {
    
    this.isSubmit = true;  
       
    const _propertyListValue = this.armPropertyList();

    this.request = {
      name: this.form.controls['name'].value,
      propertyListValue: _propertyListValue
    }     
    
    this.itemsService.update(this.localStorage.getDataItem()._id, this.request).subscribe({
      next: (success) => {
        
        let successMessage = 'Item editada com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Item editada com sucesso!'
            break;
          case 'en':
            successMessage = 'Article successfully edited!'
            break;
          case 'fr':
            successMessage = 'Article modifiée avec succès'
            break;
          case 'es':
            successMessage = 'Artículo editada con éxito!'
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

  onInput(value: string, position: number) {
    this.propertyListValue[position].value = value;
  }

  armPropertyList(){
    const _propertyList = this.propertyListValue;

    for (let i = 0; i < _propertyList.length; i++){
        delete _propertyList[i].required;
    }
    return _propertyList;
  }

}

