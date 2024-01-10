import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user-administracao',
  templateUrl: './register-user-administracao.component.html',
  styleUrls: ['./register-user-administracao.component.scss']
})
export class RegisterUserAdministracaoComponent implements OnInit {

  form!: FormGroup;
  isSubmit: boolean = false;

  rolesList = [
    { value: 'geral', name: 'Administrador Geral' },
  ];

  storedLanguage : string | null

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', [ Validators.required, Validators.maxLength(50) ]],
      email: ['', [ Validators.required, Validators.email ]],
      type: ['administrador', [ Validators.required ]],
      roles: ['geral', [ Validators.required ]]
    });
  }


  ngOnInit(): void {
    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }

  onSubmit() {
    this.isSubmit = true;
    if(this.form.status == 'INVALID') {
      return;
    }

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

        this.toastrService.success(successMessage, '', { progressBar: true });
        this.router.navigate(['/controle-admin']);
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

        if (error.error.errors[0].includes('duplicate key')) {
          if (error.error.errors[0].includes('email')) {
            this.toastrService.error(errorEmail, '', { progressBar: true });
          } else if (error.error.errors[0].includes('phone')) {
            this.toastrService.error(errorPhone, '', { progressBar: true });
          } else if (error.error.errors[0].includes('cpf')) {
            this.toastrService.error(errorCPFCNPJ, '', { progressBar: true });
          }
        } else {
          this.toastrService.error(error.error.errors[0], '', { progressBar: true });
        }
        
      }
    });

  }

}
