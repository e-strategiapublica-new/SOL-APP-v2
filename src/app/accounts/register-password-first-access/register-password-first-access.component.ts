import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageKeysEnum } from 'src/enums/local-storage-keys.enum';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-register-password-first-access',
  templateUrl: './register-password-first-access.component.html',
  styleUrls: ['./register-password-first-access.component.scss']
})
export class RegisterPasswordFirstAccessComponent implements OnInit {

  isSubmit: boolean = false;
  form!: FormGroup;
  

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private ngxSpinnerService: NgxSpinnerService
  ) {
    this.form = this.formBuilder.group({
      code: [localStorage.getItem(LocalStorageKeysEnum.code), [Validators.required, Validators.minLength(5)]],
      email: [localStorage.getItem(LocalStorageKeysEnum.email)],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      confirmNewPassword: ['', [Validators.required]],
      enableTerms: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {

  }
  exit() {
    this.modalService.dismissAll();
  }
  onSubmit() {
    this.isSubmit = true;
    if (this.form.status == 'INVALID' || this.form.controls['newPassword'].value !== this.form.controls['confirmNewPassword'].value) {
      return;
    }

    this.ngxSpinnerService.show();
    this.userService.resetPasswordConfirmation(this.form.value).subscribe({
      next: (data) => {
        this.toastrService.success('Senha registrada com sucesso!', '', { progressBar: true });
        localStorage.clear();
        this.router.navigate(['']);
        this.ngxSpinnerService.hide();
      },
      error: (error) => {
        console.error(error);
        this.ngxSpinnerService.hide();
        this.toastrService.error(error.error.errors[0], '', { progressBar: true });

        if (error.error.errors[0] == 'Código expirado!') {
          localStorage.clear();
          this.router.navigate(['/accounts/primeiro-acesso']);
        }

      }

    });
  }

  open(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }

}