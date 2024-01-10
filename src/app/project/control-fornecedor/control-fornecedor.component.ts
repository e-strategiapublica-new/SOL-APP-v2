import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { UserTypeEnum } from 'src/enums/user-type.enum';
import { UserService } from 'src/services/user.service';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { SupplierService } from 'src/services/supplier.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import FilterFuzzy from 'src/utils/filterFuzzy.util';
import Fuse from 'fuse.js';
import { AuthService } from 'src/services/auth.service';


@Component({
  selector: 'app-control-fornecedor',
  templateUrl: './control-fornecedor.component.html',
  styleUrls: ['./control-fornecedor.component.scss']
})
export class ControlFornecedorComponent {
  currentPage: number = 1;
  itensPerPage: number = 8;
  userList!: UserListResponseDto[];
  userFilterList!: UserListResponseDto[];
  form: FormGroup;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private supplierService: SupplierService,
    private ngbModal: NgbModal,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      search: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.list()
    this.form.controls['search'].valueChanges.subscribe((text: string) => {
      if (text) {
        // this.userList = this.userList.filter((item: any) =>
        //   item.name.toLowerCase().includes(text) ||
        //   item.document.toLowerCase().includes(text) ||
        //   item.phone.toLowerCase().includes(text) ||
        //   item.email.toLowerCase().includes(text)
        // );
        // const array: any = []
        

        // for (let item of this.userFilterList){
        //   array.push({termo: item.name.toLowerCase(), id: item._id})
        //   array.push({termo: item.email.toLowerCase(), id: item._id})
        //   array.push({termo: item.document.toLowerCase(), id: item._id})
      
  
        //   //array.push({termo: item.cnpj, id: item._id})
         
        // }
        // const results = FilterFuzzy.fuzzySearch(text, array);
        // this.userList = this.userFilterList.filter((item: any) => results.find((element) => element.item.id === item._id && element.distancia === 0))
        // if(this.userList.length) return;
  
        // this.userList = []
        // for (let item of results){
        //   this.userList.push(this.userFilterList.find((element: any) => element._id === item.item.id))
        // }        

        const documents = this.userList.filter(obj => ((obj.document).toLowerCase()).includes(text.toLowerCase()));
        const name = this.userList.filter(obj => ((obj.name).toLowerCase()).includes(text.toLowerCase()));
        const email = this.userList.filter(obj => ((obj.email).toLowerCase()).includes(text.toLowerCase()));
        const supplier = this.userList.filter(obj => ((obj.supplier).toLowerCase()).includes(text.toLowerCase()));

        const array = [...documents, ...name, ...email, ...supplier]  
        const dataArr = new Set(array)
        const result = [...dataArr];
         
        this.userFilterList = result
      }
  
      else
        this.userFilterList = this.userList
    });
  }

  list(){
    this.userService.listByType(UserTypeEnum.fornecedor).subscribe({
      next: (data) => {
        this.supplierService.supplierList().subscribe({
          next: (successSup) => {
            for (let user of data) {
              for (let sup of successSup) {
                if (user.supplier == sup._id) {
                  user.supplier = sup.name
                }
              }
            }
            this.userList = data;
            this.userFilterList = data;           
            this.ngxSpinnerService.hide();
          },
          
          error: (error) => {
            console.error(error.error.errors[0]);
          }
        });
      
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
    this.router.navigate(['/pages/controle-fornecedor/dados-usuario/' + id]);
  }

}
