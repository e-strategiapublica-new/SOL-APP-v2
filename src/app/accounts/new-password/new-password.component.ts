import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageKeysEnum } from 'src/enums/local-storage-keys.enum';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {

  isSubmit: boolean = false;
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastrService: ToastrService,
    private ngxSpinnerService: NgxSpinnerService
  ) {
    this.form = this.formBuilder.group({
      code: [localStorage.getItem(LocalStorageKeysEnum.code), [Validators.required, Validators.minLength(5)]],
      email: [localStorage.getItem(LocalStorageKeysEnum.email)],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      confirmNewPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.status == 'INVALID' || this.form.controls['newPassword'].value !== this.form.controls['confirmNewPassword'].value) {
      return;
    }

    this.ngxSpinnerService.show();
    this.userService.resetPasswordConfirmation(this.form.value).subscribe({
      next: (data) => {
        this.toastrService.success('Senha alterada com sucesso!', '', { progressBar: true });
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

}
