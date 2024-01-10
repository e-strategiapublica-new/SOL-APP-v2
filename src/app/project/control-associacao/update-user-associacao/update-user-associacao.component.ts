import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { AssociationService } from 'src/services/association.service';
import { UserService } from 'src/services/user.service';
import UserDataValidator from 'src/utils/user-data-validator.utils';

@Component({
  selector: 'app-update-user-associacao',
  templateUrl: './update-user-associacao.component.html',
  styleUrls: ['./update-user-associacao.component.scss']
})
export class UpdateUserAssociacaoComponent implements OnInit {

  form!: FormGroup;
  isSubmit: boolean = false;
  userId!: string;
  associationList!: AssociationResponseDto[];
  regex = /\b(\d)\1+\b/
  storedLanguage: string | null;
  validCnpj: boolean = true

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
    private activatedRoute: ActivatedRoute,
    private associationService: AssociationService
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      type: ['associacao', [Validators.required]],
      office: [null, [Validators.required]],
      association: [null, [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      document: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {

    this.ngxSpinnerService.show();
    this.activatedRoute.params.subscribe((params) => {

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

      this.userService.getById(params['id']).subscribe({
        next: (success) => {
          this.userId = success._id;
          this.form.patchValue({
            name: success.name,
            email: success.email,
            office: success.office,
            association: success.association?._id,
            phone: success.phone,
            document: success.document
          });

          this.ngxSpinnerService.hide();
        },
        error: (error) => {
          console.error(error);
          this.router.navigate(['/controle-associacao']);
          this.ngxSpinnerService.hide();
        }
      });
    });

  }

  checkValidCnpj() {
    if (this.form.controls["document"].value.length > 11){
      this.validCnpj = UserDataValidator.validarCNPJ(this.form.controls["document"].value)
  }
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

  onSubmit() {

    this.isSubmit = true;
    if (this.form.status == 'INVALID' || (this.form.controls['document'].value?.length !== 11 && this.form.controls['document'].value?.length !== 14)) {
      return;
    }

    this.ngxSpinnerService.show();
    this.userService.updateById(this.userId, this.form.value).subscribe({
      next: (success) => {

        let successMessage = 'Usuário editado com sucesso!';

        switch (this.storedLanguage) {
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

        this.ngxSpinnerService.hide();
        this.toastrService.success(successMessage, '', { progressBar: true });
        this.router.navigate(['/controle-associacao']);
      },
      error: (error) => {
        console.error(error);
        this.ngxSpinnerService.hide();
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });
      }
    });

    this.storedLanguage = localStorage.getItem('selectedLanguage');

  }

}
