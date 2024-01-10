import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClassesResponseDto } from 'src/dtos/classes/classes-response.dto';
import { ClassesService } from 'src/services/classes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import FilterFuzzy from 'src/utils/filterFuzzy.util';
import Fuse from 'fuse.js';
import { AuthService } from 'src/services/auth.service';
import { DeleteClassComponent } from './delete-class/delete-class.component';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent  implements OnInit{

  currentPage: number = 1;
  itensPerPage: number = 8;  
  form: FormGroup
  user:any
  classesList: any[];
  classesFilterList: any[];
  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private classesService: ClassesService,
    private ngxSpinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    public router: Router

  ) { 
    this.form = this.formBuilder.group({
      search: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
     
    const id = localStorage.getItem('id_classes');
    if(id && id == '0'){
      localStorage.removeItem('id_classes')
      this.classesFilterList = this.classesService.getClassesFilterList();
      this.classesList = this.classesService.getClassesList();      
    }else{      
      this.ngxSpinnerService.show();
      this.getClasses()
    }     

    this.form.controls['search'].valueChanges.subscribe((text: string) => {
      if (text){             
          
          const code = this.classesList.filter(obj => (obj.group.code+''+obj.code).includes(text));
          const groupSegment = this.classesList.filter(obj => ((obj.group.segment).toLowerCase()).includes(text.toLowerCase()));
          const description = this.classesList.filter(obj => ((obj.description).toLowerCase()).includes(text.toLowerCase()));      

          const array = [...code, ...groupSegment, ...description]    
         
          const dataArr = new Set(array)        
          const result = [...dataArr];
                 
          this.classesFilterList = result          
        
      }
      else
        this.classesFilterList = this.classesList
    });

  }

  checkUser(){
    const equal = this.user.type === this.authService.getAuthenticatedUser().type;
    if(!equal){
      window.location.reload();
    }
    return equal;
  }

  getClasses() {      
    this.classesService.getClasses().subscribe({
      next: data => {        
        this.classesList = data;
        this.classesFilterList = data
        this.classesService.setClassesFilterList(data);
        this.classesService.setClassesList(data);
        this.ngxSpinnerService.hide();
      },
      error: error => {        
        this.ngxSpinnerService.hide();
        this.classesFilterList = [];
      }
    });

  }

  editClass(i: any) {
      localStorage.setItem('editclass', JSON.stringify(i));
      this.router.navigate(['pages/classes/editar-class']);
  }

  delete(i: any, Id: string) {   
    localStorage.setItem('class_id', Id);
    const modal = this.modalService.open(DeleteClassComponent, { centered: true, backdrop: true, size: 'md',keyboard: false })        
    modal.result.then((result) => {
    }, err => {      
      this.getClasses();
    })
  }
}

