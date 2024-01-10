import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { AssociationService } from 'src/services/association.service';
import { UserService } from 'src/services/user.service';
import UserDataValidator from 'src/utils/user-data-validator.utils';

@Component({
  selector: 'app-register-user-associacao',
  templateUrl: './register-user-associacao.component.html',
  styleUrls: ['./register-user-associacao.component.scss']
})
export class RegisterUserAssociacaoComponent implements OnInit {

  form!: FormGroup;
  isSubmit: boolean = false;
  associationList!: AssociationResponseDto[];
  regex =  /\b(\d)\1+\b/
  validCnpj: boolean = true

  storedLanguage : string | null

  // offices = [
  //   { id: 1, name: 'cargo 1' },
  //   { id: 2, name: 'cargo 2' },
  //   { id: 3, name: 'cargo 3' },
  //   { id: 4, name: 'cargo 4' },
  //   { id: 5, name: 'cargo 5' }
  // ];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private associationService: AssociationService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      type: ['associacao', [Validators.required]],
      office: [ '', [Validators.required]],
      association: [ null, [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      document: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.associationService.list().subscribe({
      next: (success) => {
        this.associationList = success;
        this.ngxSpinnerService.hide();
      },
      error: (error) => {
        console.error(error);
        this.ngxSpinnerService.hide();
      }
    });

    this.storedLanguage = localStorage.getItem('selectedLanguage');
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

  checkValidDocument() {
    if (this.form.controls["document"].value.length > 11) {
      this.validCnpj = UserDataValidator.validarCNPJ(this.form.controls["document"].value)
    }
    
  }

  isCPFInvalidAndTouched(): boolean {
    const cpfControl = this.form.controls['document'];

    return cpfControl.dirty && !this.validarCPF(cpfControl.value);
  };
 

  onSubmit() {
    
    this.isSubmit = true;
 
    if (this.form.status == 'INVALID' || (this.form.controls['document'].value?.length !== 11 && this.form.controls['document'].value?.length !== 14)) {
      return;
    }
    
    this.ngxSpinnerService.show();
    this.userService.register(this.form.value).subscribe({
      next: (success) => {
        
        let successMessage = 'Usuário cadastrado com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Usuário cadastrado com sucesso!'
            break;
          case 'en':
            successMessage = 'User successfully registered!'
            break;
          case 'fr':
            successMessage = 'Utilisateur enregistré avec succès !'
            break;
          case 'es':
            successMessage = '¡Usuario registrado con éxito!'
            break;
        }

        this.ngxSpinnerService.hide();
        this.toastrService.success(successMessage, '', { progressBar: true });
        this.router.navigate(['/controle-associacao']);
      },
      error: (error) => {
        
        let errorEmail = 'Esse email ja foi cadastrado!';
        let errorPhone = 'Esse telefone ja foi cadastrado!';
        let errorCPFCNPJ = 'Esse CPF/CNPJ ja foi cadastrado!';

        switch(this.storedLanguage) {
          case 'pt': 
            errorEmail = 'Esse email ja foi cadastrado!';
            errorPhone = 'Esse telefone ja foi cadastrado!';
            errorCPFCNPJ = 'Esse CPF/CNPJ ja foi cadastrado!';
            break;
          case 'en':
            errorEmail = 'This email has already been registered!';
            errorPhone = 'This phone has already been registered!';
            errorCPFCNPJ = 'This CPF/CNPJ has already been registered!';
            break;
          case 'fr':
            errorEmail = 'Cet e-mail a déjà été enregistré !';
            errorPhone = 'Ce téléphone a déjà été enregistré !';
            errorCPFCNPJ = 'Ce CPF/CNPJ est déjà inscrit !';
            break;
          case 'es':
            errorEmail = '¡Este correo electrónico ya ha sido registrado!';
            errorPhone = '¡Este teléfono ya ha sido registrado!';
            errorCPFCNPJ = '¡Este CPF/CNPJ ya ha sido registrado!';
            break;
        }

        console.error(error);
        this.ngxSpinnerService.hide();
        if (error.error.errors[0].includes('duplicate key')) {
          if (error.error.errors[0].includes('email')) {
            this.toastrService.error(errorEmail, '', { progressBar: true });
          } else if (error.error.errors[0].includes('phone')) {
            this.toastrService.error(errorEmail, '', { progressBar: true });
          } else if (error.error.errors[0].includes('cpf')) {
            this.toastrService.error(errorEmail, '', { progressBar: true });
          }
        } else {
          this.toastrService.error(error.error.errors[0], '', { progressBar: true });
        }
      }
    });

  }

}