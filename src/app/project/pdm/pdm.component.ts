import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { PdmService } from 'src/services/pdm.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import FilterFuzzy from 'src/utils/filterFuzzy.util';
import { AuthService } from 'src/services/auth.service';
import { DeletePdmComponent } from './delete-pdm/delete-pdm.component';

@Component({
  selector: 'app-pdm',
  templateUrl: './pdm.component.html',
  styleUrls: ['./pdm.component.scss']
})
export class PDMComponent  implements OnInit{

  currentPage: number = 1;
  itensPerPage: number = 8;  
  form: FormGroup
  user:any
  pdmList: any[];
  pdmFilterList: any[];
  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private pdmService: PdmService,
    private ngxSpinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    public router: Router

  ) { 
    this.form = this.formBuilder.group({
      search: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {

    const id = localStorage.getItem('id_pdm');
    if(id && id == '0'){      
      localStorage.removeItem('id_pdm')
      this.pdmFilterList = this.pdmService.getPdmFilterList();
      this.pdmList = this.pdmService.getPdmList();
    }else{
      this.ngxSpinnerService.show();
      this.getPdm()  
    } 

    this.form.controls['search'].valueChanges.subscribe((text: string) => {
      if (text){
        
        const _class = this.pdmList.filter(obj => (obj.group.code+''+obj.class.code+''+obj.class.description).toString().toLowerCase().includes(text.toLowerCase()));
        const code = this.pdmList.filter(obj => ((obj.code).toString().includes(text.toLowerCase())));
        const name = this.pdmList.filter(obj => ((obj.name).toLowerCase()).includes(text.toLowerCase()));
        
        const array = [..._class, ...code, ...name]        
        const dataArr = new Set(array)
        const result = [...dataArr];
         
        this.pdmFilterList = result
      }
      else
      this.pdmFilterList = this.pdmList
    });

  }

  checkUser(){
    const equal = this.user.type === this.authService.getAuthenticatedUser().type;
    if(!equal){
      window.location.reload();
    }
    return equal;
  }
  getPdm() {
    this.pdmService.getPdm().subscribe({
      next: data => {
        this.pdmList = data;
        this.pdmFilterList = data
        this.pdmService.setPdmFilterList(data);
        this.pdmService.setPdmList(data);
        this.ngxSpinnerService.hide();
      },
      error: error => {
        this.ngxSpinnerService.hide();
        this.pdmFilterList = [];
      }
    });
  }

  editPdm(i: any) {
      localStorage.setItem('editpdm', JSON.stringify(i));
      this.router.navigate(['pages/pdm/editar-pdm']);
  }

  delete(i: any, Id: string) {
    localStorage.setItem('editpdm', JSON.stringify(i));
    const modal = this.modalService.open(DeletePdmComponent, { centered: true, backdrop: true, size: 'md',keyboard: false })
    modal.result.then((result) => {
    }, err => {
      this.getPdm();
    })
  }  

}

