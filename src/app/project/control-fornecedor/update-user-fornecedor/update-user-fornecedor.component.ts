import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from 'src/services/supplier.service';
import { UserService } from 'src/services/user.service';
import UserDataValidator from 'src/utils/user-data-validator.utils';

@Component({
  selector: 'app-update-user-fornecedor',
  templateUrl: './update-user-fornecedor.component.html',
  styleUrls: ['./update-user-fornecedor.component.scss']
})
export class UpdateUserFornecedorComponent implements OnInit {

  form!: FormGroup;
  isSubmit: boolean = false;
  userId!: string;
  regex =  /\b(\d)\1+\b/
  supplierList: any
  validCnpj: boolean = true 

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private supplierService: SupplierService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      type: ['fornecedor', [Validators.required]],
      supplier: [null, [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      document: ['', [Validators.required]],
    });
  }

  validarCPF(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    if (cpf.length != 11 ||
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999")
      return false;
    let add = 0;
    for (let i = 0; i < 9; i++)
      add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
      return false;
    add = 0;
    for (let i = 0; i < 10; i++)
      add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
      return false;
    return true;
  };

  isCPFInvalidAndTouched(): boolean {
    const cpfControl = this.form.controls['document'];

    return cpfControl.dirty && !this.validarCPF(cpfControl.value);
  };

  checkValidCnpj() {
    if(this.form.controls['document'].value.length > 11) {
      this.validCnpj = UserDataValidator.validarCNPJ(this.form.controls['document'].value)
    }
  }

  ngOnInit(): void {

    this.ngxSpinnerService.show();
    this.activatedRoute.params.subscribe((params) => {
      this.userService.getById(params['id']).subscribe({
        next: (success) => {
          this.userId = success._id;
          this.form.patchValue({
            name: success.name,
            email: success.email,
            supplier: success.supplier,
            phone: success.phone,
            document: success.document
          });
          this.supplierList = success.supplier.name
   
          this.ngxSpinnerService.hide();
          // this.supplierService.supplierList().subscribe({
          //   next: (successSup) => {
          //     for(let sup of successSup){
          //       if(success.supplier == sup._id){
          //         this.form.patchValue({
          //           name: success.name,
          //           email: success.email,
          //           supplier: sup.name,
          //           phone: success.phone,
          //           document: success.document
          //         });
        
          //       }
          //     }
          //     this.ngxSpinnerService.hide();
              
              
          //     this.supplierList = success;
          //   },
          //   error: (error) => {
          //     console.error(error.error.errors[0]);
          //     this.ngxSpinnerService.hide();
          //   }
          // });
      
        },
        error: (error) => {
          console.error(error);
          this.router.navigate(['/controle-fornecedor']);
          this.ngxSpinnerService.hide();
        }
      });
    });

  }

  onSubmit() {

    this.isSubmit = true;
    if (this.form.status == 'INVALID' || (this.form.controls['document'].value?.length !== 11 && this.form.controls['document'].value?.length !== 14)) {
      return;
    }
    

    this.userService.updateById(this.userId, this.form.value).subscribe({
      next: (success) => {
        this.toastrService.success('Usuário editado com sucesso!', '', { progressBar: true });
        this.router.navigate(['/controle-fornecedor']);
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });

  }

}