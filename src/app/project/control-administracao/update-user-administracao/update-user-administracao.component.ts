import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-update-user-administracao',
  templateUrl: './update-user-administracao.component.html',
  styleUrls: ['./update-user-administracao.component.scss']
})
export class UpdateUserAdministracaoComponent implements OnInit {

  form!: FormGroup;
  isSubmit: boolean = false;
  userId!: string;

  storedLanguage : string | null

  rolesList = [
    { value: 'geral', name: 'Administrador Geral' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      type: ['administrador', [Validators.required]],
      roles: ['geral', [Validators.required]]
    });
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
            roles: success.roles
          });

          this.ngxSpinnerService.hide();
        },
        error: (error) => {
          console.error(error);
          this.router.navigate(['/controle-admin']);
          this.ngxSpinnerService.hide();
        }
      });
    });

    this.storedLanguage = localStorage.getItem('selectedLanguage');

  }

  onSubmit() {

    this.isSubmit = true;
    if (this.form.status == 'INVALID') {
      return;
    }

    this.userService.updateById(this.userId, this.form.value).subscribe({
      next: (success) => {

        let successMessage = 'Usuário editado com sucesso!';

        switch(this.storedLanguage) {
          case 'pt': 
            successMessage = 'Usuário editado com sucesso!'
            break;
          case 'en':
            successMessage = 'User successfully edited!'
            break;
          case 'fr':
            successMessage = 'Utilisateur modifié avec succès !'
            break;
          case 'es':
            successMessage = '¡Usuario editado con éxito!'
            break;
        }

        this.toastrService.success(successMessage, '', { progressBar: true });
        this.router.navigate(['/controle-admin']);
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });

  }

  cancel(){      
    localStorage.setItem('id_user_admin','0');
    this.router.navigate(['/pages/controle-admin']);
  }

}