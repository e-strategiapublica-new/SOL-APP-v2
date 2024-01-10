import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { UserTypeEnum } from 'src/enums/user-type.enum';
import { UserService } from 'src/services/user.service';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import FilterFuzzy from 'src/utils/filterFuzzy.util';
import Fuse from 'fuse.js';
import { AuthService } from 'src/services/auth.service';


@Component({
  selector: 'app-control-associacao',
  templateUrl: './control-associacao.component.html',
  styleUrls: ['./control-associacao.component.scss']
})
export class ControlAssociacaoComponent implements OnInit {
  currentPage: number = 1;
  itensPerPage: number = 8;

  userList!: UserListResponseDto[];
  userFilterList!: UserListResponseDto[];
  form: FormGroup;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private readonly ngbModal: NgbModal,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      search: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    
    const id = localStorage.getItem('id_user_associations');
    if(id && id == '0'){      
      localStorage.removeItem('id_user_associations')
      this.userFilterList = this.userService.getUserFilterList();
      this.userList = this.userService.getUserList();
    }else{
      this.list()  
    }    
        
    this.form.controls['search'].valueChanges.subscribe((text: string) => {
      if (text) {      
      
      const documents = this.userList.filter(obj => ((obj.document).toLowerCase()).includes(text.toLowerCase()));      
      const name = this.userList.filter(obj => ((obj.name).toLowerCase()).includes(text.toLowerCase()));
      const email = this.userList.filter(obj => ((obj.email).toLowerCase()).includes(text.toLowerCase()));
      
      const association_name = this.userList.filter(obj => {
          if(obj.association){
            ((obj.association.name).toLowerCase()).includes(text.toLowerCase())
          }
      })
      
      const array = [...documents, ...name, ...email, ...association_name ]
      const dataArr = new Set(array)
      const result = [...dataArr];
       
      this.userFilterList = result
    }

    else
      this.userFilterList = this.userList
  });

  }
  list(){
    this.userService.listByType(UserTypeEnum.associacao).subscribe({
      next: (data) => {
        this.userList = data;
        this.userFilterList = data
        this.userService.setUserFilterList(data);
        this.userService.setUserList(data);
        this.ngxSpinnerService.hide();
      },
      error: (err) => {
        console.error(err);
        this.ngxSpinnerService.hide();
      }
    })
  }

  openModal(item: UserListResponseDto) {
    this.userService.deleteUser = item;
    this.userService.deleted = false;

    const modal = this.ngbModal.open(DeleteUserComponent, {
      centered: true,
      backdrop: true,
      size: 'md',
    });
    modal.result.then((data: any) => {
    }, (error: any) => {
      if (this.userService.deleted) {
        const i = this.userList.findIndex(x => x._id === this.userService.deleteUser?._id);
        this.userList.splice(i, 1);
      }
      this.userService.deleteUser = null;
      this.userService.deleted = false;
    });

  }
  navigateToItem(id: string) {
    this.router.navigate(['/pages/controle-associacao/dados-usuario/' + id]);
  }

}
