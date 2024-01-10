import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/services/user.service';
import { Component, OnInit } from '@angular/core';
import { UserTypeEnum } from 'src/enums/user-type.enum';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import FilterFuzzy from 'src/utils/filterFuzzy.util';
import Fuse from 'fuse.js';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-control-administracao',
  templateUrl: './control-administracao.component.html',
  styleUrls: ['./control-administracao.component.scss']
})
export class ControlAdministracaoComponent implements OnInit {

  currentPage: number = 1;
  itensPerPage: number = 8;

  userList!: UserListResponseDto[];
  userFilterList!: UserListResponseDto[]
  form: FormGroup;

  constructor(
    public authbase: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    private ngbModal: NgbModal,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      search: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    
    const id = localStorage.getItem('id_user_admin');
    if(id && id == '0'){      
      localStorage.removeItem('id_user_admin')
      this.userFilterList = this.userService.getUserAdminFilterList();
      this.userList = this.userService.getUserAdminList();
    }else{
      this.list()  
    } 

    this.form.controls['search'].valueChanges.subscribe((text: string) => {
      if (text) {
        // this.userList = this.userList.filter((item: any) =>
        //   item.name.toLowerCase().includes(text) ||
        //   item.email.toLowerCase().includes(text) 
         
         
        // );
        // const array: any = []
        

        // for (let item of this.userFilterList){
        //   array.push({termo: item.name.toLowerCase(), id: item._id})
        //   array.push({termo: item.email.toLowerCase(), id: item._id})
        //   array.push({termo: item.roles.toLowerCase(), id: item._id})
      
  
        //   //array.push({termo: item.cnpj, id: item._id})
         
        // }
        // const results = FilterFuzzy.fuzzySearch(text, array);
        // this.userList = this.userFilterList.filter((item: any) => results.find((element) => element.item.id === item._id && element.distancia === 0))
        // if(this.userList.length) return;
  
        // this.userList = []
        // for (let item of results){
        //   this.userList.push(this.userFilterList.find((element: any) => element._id === item.item.id))
        // }       
         
        const roles = this.userList.filter(obj => ((obj.roles).toLowerCase()).includes(text.toLowerCase()));
        const name = this.userList.filter(obj => ((obj.name).toLowerCase()).includes(text.toLowerCase()));
        const email = this.userList.filter(obj => ((obj.email).toLowerCase()).includes(text.toLowerCase()));

        const array = [...roles, ...name, ...email]  
        const dataArr = new Set(array)
        const result = [...dataArr];
         
        this.userFilterList = result
      }
  
      else
        this.userFilterList = this.userList
    });
   
  }
  list(){
  
      this.userService.listByType(UserTypeEnum.administrador).subscribe({
        next: (data) => {
          this.userList = data //.filter((item: any) => item._id !== this.authbase.getAuthenticatedUser().id);
          this.userFilterList = data //.filter((item: any) => item._id !== this.authbase.getAuthenticatedUser().id)
          this.userService.setUserAdminFilterList(data);
          this.userService.setUserAdminList(data);
          this.ngxSpinnerService.hide();
        },
        error: (err) => {
          console.error(err);
          this.ngxSpinnerService.hide();
        }
      })

   
      this.userService.listByType(UserTypeEnum.administrador).subscribe({
        next: (data) => {
          this.userList = data;
          this.userFilterList = data
          this.userService.setUserAdminFilterList(data);
          this.userService.setUserAdminList(data);
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
    this.router.navigate(['/pages/controle-admin/dados-usuario/' + id]);
  }

}
