import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from 'src/services/items.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { DeleteItemComponent } from './delete-item/delete-item.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent  implements OnInit{

  currentPage: number = 1;
  itensPerPage: number = 8;  
  form: FormGroup
  user:any
  itemList: any[];
  itemFilterList: any[];
  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private itemsService: ItemsService,
    private ngxSpinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    public router: Router

  ) { 
    this.form = this.formBuilder.group({
      search: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {

    const id = localStorage.getItem('id_items');
    if(id && id == '0'){      
      localStorage.removeItem('id_items')
      this.itemFilterList = this.itemsService.getItemFilterList();
      this.itemList = this.itemsService.getItemList();
    }else{
      this.ngxSpinnerService.show();
      this.getItems()  
    } 

    this.form.controls['search'].valueChanges.subscribe((text: string) => {
      if (text){
        
        const pdm = this.itemList.filter(obj => (obj.pdm.code+''+obj.pdm.name).toString().toLowerCase().includes(text.toLowerCase()));
        const _class = this.itemList.filter(obj => ((obj.group.code+''+obj.class.code).toLowerCase()).includes(text.toLowerCase()));
        const code = this.itemList.filter(obj => ((obj.code).toString().includes(text.toLowerCase())));
        const name = this.itemList.filter(obj => ((obj.name).toLowerCase()).includes(text.toLowerCase()));
        
        const array = [...pdm, ..._class, ...code, ...name]        
        const dataArr = new Set(array)
        const result = [...dataArr];
         
        this.itemFilterList = result
      }
      else
      this.itemFilterList = this.itemList
    });

  }

  checkUser(){
    const equal = this.user.type === this.authService.getAuthenticatedUser().type;
    if(!equal){
      window.location.reload();
    }
    return equal;
  }
  getItems() {
    this.itemsService.getItems().subscribe({
      next: data => {
        this.itemList = data;
        this.itemFilterList = data
        this.itemsService.setItemFilterList(data);
        this.itemsService.setItemList(data);
        this.ngxSpinnerService.hide();
      },
      error: error => {
        this.ngxSpinnerService.hide();
        this.itemFilterList = [];
      }
    });
  }

  editItem(i: any) {
      localStorage.setItem('edititem', JSON.stringify(i));
      this.router.navigate(['pages/items/editar-item']);
  }

  delete(i: any, Id: string) {    
    localStorage.setItem('edititem', JSON.stringify(i));
    const modal = this.modalService.open(DeleteItemComponent, { centered: true, backdrop: true, size: 'md',keyboard: false })
    modal.result.then((result) => {
    }, err => {
      this.getItems();
    })
  }  

}

